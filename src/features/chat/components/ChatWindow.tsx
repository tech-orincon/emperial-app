import React, { RefObject } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  ChevronLeft,
  HelpCircle,
  CreditCard,
  User,
  Shield,
  MoreVertical,
  Package,
} from 'lucide-react';

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

const quickActions = [
  {
    icon: Package,
    label: 'Track my order',
    response:
      'I can help you track your order. Please provide your order number (e.g., EMP-12345).',
  },
  {
    icon: HelpCircle,
    label: 'Ask about a service',
    response: "I'd be happy to help with service questions. What would you like to know?",
  },
  {
    icon: CreditCard,
    label: 'Payment support',
    response: 'For payment inquiries, please describe your issue.',
  },
  {
    icon: User,
    label: 'Talk to a human',
    response: 'Connecting you with a live agent. Average wait time: 2 minutes.',
  },
];

interface ChatWindowProps {
  activeConversation: Conversation;
  inputValue: string;
  onSendMessage: () => void;
  onInputChange: (value: string) => void;
  onQuickAction: (action: (typeof quickActions)[0]) => void;
  onBackToList: () => void;
  inputRef: RefObject<HTMLInputElement>;
  messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatWindow({
  activeConversation,
  inputValue,
  onSendMessage,
  onInputChange,
  onQuickAction,
  onBackToList,
  inputRef,
  messagesEndRef,
}: ChatWindowProps) {
  const isSupport = activeConversation.type === 'support';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-slate-800/50">
        <button
          onClick={onBackToList}
          className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div className="relative shrink-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
              isSupport
                ? 'bg-gradient-to-br from-emperial-500 to-purple-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
            }`}>
            {activeConversation.avatar}
          </div>
          {activeConversation.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm flex items-center gap-1">
            {activeConversation.name}
            {isSupport && <Shield className="w-3 h-3 text-emperial-400" />}
          </h3>
          {activeConversation.orderId ? (
            <p className="text-xs text-purple-400">Order #{activeConversation.orderId}</p>
          ) : (
            <p className="text-xs text-slate-400 flex items-center gap-1">
              {activeConversation.isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Online
                </>
              ) : (
                'Offline'
              )}
            </p>
          )}
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg">
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation.messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                message.isMe
                  ? 'bg-emperial-500 text-white rounded-tr-sm'
                  : 'bg-slate-800 text-slate-200 rounded-tl-sm'
              }`}>
              {message.text}
            </div>
          </motion.div>
        ))}

        {/* Quick Actions for Support */}
        {isSupport && activeConversation.messages.length <= 2 && (
          <div className="pt-2">
            <p className="text-xs text-slate-500 mb-3">Quick actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onQuickAction(action)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-white/5 text-left hover:bg-slate-800 hover:border-emperial-500/30 transition-all group">
                  <action.icon className="w-4 h-4 text-emperial-400 group-hover:text-emperial-300" />
                  <span className="text-xs text-slate-300 group-hover:text-white">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-slate-800/30">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emperial-500"
          />
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="w-11 h-11 rounded-xl bg-emperial-500 text-white flex items-center justify-center hover:bg-emperial-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
