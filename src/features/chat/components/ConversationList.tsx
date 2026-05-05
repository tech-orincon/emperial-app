import { motion } from 'framer-motion'
import { Search, MessageCircle } from 'lucide-react'
import type { UiConversation } from '../types/chat.types'

interface Props {
  conversations: UiConversation[]
  activeChannelId: string | null
  onSelect: (id: string) => void
  formatTime: (date: Date) => string
}

export function ConversationList({ conversations, activeChannelId, onSelect, formatTime }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-white text-lg mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emperial-500"
            readOnly
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">No conversations yet</p>
            <p className="text-xs text-slate-600 mt-1">Chats open automatically when your order is accepted</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 bg-slate-800/30">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order Chats</span>
            </div>
            {conversations.map((conv) => (
              <motion.button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${activeChannelId === conv.id ? 'bg-purple-500/10' : ''}`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    #{conv.orderId}
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white truncate">{conv.name}</span>
                    <span className="text-xs text-slate-500 shrink-0 ml-2">
                      {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                </div>
                {conv.isUnread && (
                  <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-purple-500 mt-2" />
                )}
              </motion.button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
