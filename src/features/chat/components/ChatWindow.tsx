import { RefObject } from 'react'
import { motion } from 'framer-motion'
import { Send, ChevronLeft, Lock } from 'lucide-react'
import type { ChannelStatus, UiConversation, UiMessage } from '../types/chat.types'

const MESSAGING_ALLOWED: ChannelStatus[] = ['ACCEPTED', 'IN_PROGRESS', 'DISPUTED']

const STATUS_NOTICE: Partial<Record<ChannelStatus, { text: string; color: string }>> = {
  COMPLETED: { text: 'This order is completed. Chat is now closed.', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  CANCELLED:  { text: 'This order was cancelled. Messaging is disabled.', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  DISPUTED:   { text: 'This order is under dispute. Support may join the chat.', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
}

interface Props {
  conversation: UiConversation
  messages: UiMessage[]
  isLoading: boolean
  inputValue: string
  isSending: boolean
  onSend: () => void
  onInputChange: (value: string) => void
  onBackToList: () => void
  inputRef: RefObject<HTMLInputElement>
  messagesEndRef: RefObject<HTMLDivElement>
}

export function ChatWindow({
  conversation, messages, isLoading,
  inputValue, isSending, onSend, onInputChange,
  onBackToList, inputRef, messagesEndRef,
}: Props) {
  const canSend = MESSAGING_ALLOWED.includes(conversation.status)
  const notice = STATUS_NOTICE[conversation.status]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-slate-800/50">
        <button onClick={onBackToList} className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          #{conversation.orderId}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm">{conversation.name}</h3>
          <p className="text-xs text-purple-400">Real-time chat</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-slate-500 text-sm">No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="px-3 py-1 rounded-full text-xs text-slate-500 bg-slate-800/60 border border-white/5">
                  {msg.text}
                </span>
              </div>
            )
          }
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.isMe
                    ? 'bg-emperial-500 text-white rounded-tr-sm'
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                <p>{msg.text}</p>
                {msg.timestamp && (
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-white/60' : 'text-slate-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Status notice */}
      {notice && (
        <div className={`mx-4 mb-2 px-3 py-2 rounded-lg border text-xs flex items-center gap-2 ${notice.color}`}>
          <Lock className="w-3 h-3 shrink-0" />
          {notice.text}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-slate-800/30">
        {canSend ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emperial-500"
            />
            <button
              onClick={onSend}
              disabled={!inputValue.trim() || isSending}
              className="w-11 h-11 rounded-xl bg-emperial-500 text-white flex items-center justify-center hover:bg-emperial-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending
                ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-slate-500">
            <Lock className="w-4 h-4" />
            Messaging unavailable for this order
          </div>
        )}
      </div>
    </div>
  )
}
