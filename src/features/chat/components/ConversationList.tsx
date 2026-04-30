import React from 'react';
import { motion } from 'framer-motion';
import { Search, Shield } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  type: 'support' | 'provider';
  name: string;
  avatar: string;
  orderId?: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  messages: Message[];
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  formatTime: (date: Date) => string;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  formatTime,
}: ConversationListProps) {
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
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Support Chat - Pinned */}
        {conversations
          .filter((c) => c.type === 'support')
          .map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                activeConversationId === conv.id ? 'bg-emperial-500/10' : ''
              }`}
              whileTap={{ scale: 0.98 }}>
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {conv.avatar}
                </div>
                {conv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-900" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white flex items-center gap-1">
                    {conv.name}
                    <Shield className="w-3 h-3 text-emperial-400" />
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-emperial-500 text-white text-xs flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
              )}
            </motion.button>
          ))}

        {/* Provider Chats */}
        {conversations.filter((c) => c.type === 'provider').length > 0 && (
          <div className="px-4 py-2 bg-slate-800/30">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Provider Chats
            </span>
          </div>
        )}
        {conversations
          .filter((c) => c.type === 'provider')
          .map((conv) => (
            <motion.button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                activeConversationId === conv.id ? 'bg-purple-500/10' : ''
              }`}
              whileTap={{ scale: 0.98 }}>
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  {conv.avatar}
                </div>
                {conv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-900" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{conv.name}</span>
                  <span className="text-xs text-slate-500">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs text-purple-400 mb-0.5">Order #{conv.orderId}</p>
                <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
              )}
            </motion.button>
          ))}
      </div>
    </div>
  );
}
