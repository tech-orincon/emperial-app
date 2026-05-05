import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import { sendChatMessage } from '../../services/chat.service'
import { useChannels } from './hooks/useChannels'
import { useMessages } from './hooks/useMessages'
import { ConversationList } from './components/ConversationList'
import { ChatWindow } from './components/ChatWindow'
import type { ChannelStatus, UiConversation, UiMessage } from './types/chat.types'

const MESSAGING_ALLOWED: ChannelStatus[] = ['ACCEPTED', 'IN_PROGRESS', 'DISPUTED']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  if (diff < 86_400_000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatCenter() {
  const { firebaseUser } = useAuth()
  const uid = firebaseUser?.uid ?? null

  const {
    isOpen, activeChannelId, isMobileListView,
    openChat, closeChat, selectConversation, setIsMobileListView,
  } = useChat()

  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { channels } = useChannels(uid)
  const { messages, isLoading: isLoadingMessages } = useMessages(activeChannelId)

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when channel selected
  useEffect(() => {
    if (activeChannelId) setTimeout(() => inputRef.current?.focus(), 100)
  }, [activeChannelId])

  // Listen for external open events (e.g. Footer button)
  useEffect(() => {
    const handler = () => { openChat() }
    window.addEventListener('openChatCenter', handler)
    window.addEventListener('openChat', handler)
    return () => {
      window.removeEventListener('openChatCenter', handler)
      window.removeEventListener('openChat', handler)
    }
  }, [openChat])

  // ── Derived data ─────────────────────────────────────────────────────────────

  const conversations: UiConversation[] = channels.map((ch) => ({
    id: ch.id,
    name: `Order #${ch.orderId}`,
    avatar: String(ch.orderId),
    orderId: ch.orderId,
    status: ch.status,
    lastMessage: ch.lastMessage ?? '',
    lastMessageAt: ch.lastMessageAt?.toDate() ?? null,
    isUnread: !!ch.lastSenderId && ch.lastSenderId !== uid && ch.id !== activeChannelId,
  }))

  const uiMessages: UiMessage[] = messages.map((m) => ({
    id: m.id,
    text: m.message,
    isMe: m.senderId === uid,
    isSystem: m.type === 'SYSTEM',
    timestamp: m.createdAt?.toDate() ?? null,
  }))

  const totalUnread = conversations.filter((c) => c.isUnread).length
  const activeConversation = conversations.find((c) => c.id === activeChannelId) ?? null

  // ── Actions ───────────────────────────────────────────────────────────────────

  const handleSelectConversation = (id: string) => {
    selectConversation(id)
    setInputValue('')
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !activeChannelId || !uid || isSending) return
    if (!MESSAGING_ALLOWED.includes(activeConversation?.status ?? ('' as ChannelStatus))) return
    const text = inputValue
    setInputValue('')
    setIsSending(true)
    try {
      await sendChatMessage(activeChannelId, uid, text)
    } finally {
      setIsSending(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => openChat()}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emperial-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: '0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(59,130,246,0.2)' }}
      >
        <MessageCircle className="w-6 h-6" />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold border-2 border-slate-900"
          >
            {totalUnread}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeChat}
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed z-50 inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-[480px] lg:w-[600px] bg-slate-900/95 backdrop-blur-xl border border-white/10 md:rounded-2xl shadow-2xl flex overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.1)' }}
            >
              <button
                onClick={closeChat}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Desktop two-column layout */}
              <div className="hidden md:flex w-full">
                <div className="w-[200px] lg:w-[240px] border-r border-white/10 shrink-0">
                  <ConversationList
                    conversations={conversations}
                    activeChannelId={activeChannelId}
                    onSelect={handleSelectConversation}
                    formatTime={formatTime}
                  />
                </div>
                <div className="flex-1">
                  {activeConversation ? (
                    <ChatWindow
                      conversation={activeConversation}
                      messages={uiMessages}
                      isLoading={isLoadingMessages}
                      inputValue={inputValue}
                      isSending={isSending}
                      onSend={handleSend}
                      onInputChange={setInputValue}
                      onBackToList={() => setIsMobileListView(true)}
                      inputRef={inputRef}
                      messagesEndRef={messagesEndRef}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-400">Select a conversation to start chatting</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile single-view */}
              <div className="md:hidden w-full">
                <AnimatePresence mode="wait">
                  {isMobileListView ? (
                    <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                      <ConversationList
                        conversations={conversations}
                        activeChannelId={activeChannelId}
                        onSelect={handleSelectConversation}
                        formatTime={formatTime}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                      {activeConversation && (
                        <ChatWindow
                          conversation={activeConversation}
                          messages={uiMessages}
                          isLoading={isLoadingMessages}
                          inputValue={inputValue}
                          isSending={isSending}
                          onSend={handleSend}
                          onInputChange={setInputValue}
                          onBackToList={() => setIsMobileListView(true)}
                          inputRef={inputRef}
                          messagesEndRef={messagesEndRef}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export { ChatCenter as FloatingSupportChat }
