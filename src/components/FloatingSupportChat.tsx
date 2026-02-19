import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Package,
  HelpCircle,
  CreditCard,
  User,
  Circle } from
'lucide-react';
import { Button } from './ui/Button';
interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}
export function FloatingSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
  {
    id: 1,
    text: 'Welcome to Emperial Boosting Support. How can we help you today?',
    isBot: true,
    timestamp: new Date()
  }]
  );
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);
  const quickActions = [
  {
    icon: Package,
    label: 'Track my order',
    response:
    'I can help you track your order. Please provide your order number (e.g., EMP-12345).'
  },
  {
    icon: HelpCircle,
    label: 'Ask about a service',
    response:
    "I'd be happy to help with service questions. What would you like to know about our Mythic+, Raids, or Gold services?"
  },
  {
    icon: CreditCard,
    label: 'Payment support',
    response:
    'For payment inquiries, please describe your issue. Common topics: refunds, failed payments, or billing questions.'
  },
  {
    icon: User,
    label: 'Talk to a human',
    response:
    'Connecting you with a live agent. Average wait time: 2 minutes. A support champion will be with you shortly!'
  }];

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: action.label,
      isBot: false,
      timestamp: new Date()
    };
    const botResponse: Message = {
      id: messages.length + 2,
      text: action.response,
      isBot: true,
      timestamp: new Date()
    };
    setMessages([...messages, userMessage, botResponse]);
  };
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };
    const botResponse: Message = {
      id: messages.length + 2,
      text: 'Thanks for your message! A support agent will review this shortly. In the meantime, feel free to use the quick actions above.',
      isBot: true,
      timestamp: new Date()
    };
    setMessages([...messages, userMessage, botResponse]);
    setInputValue('');
  };
  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emperial-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        whileHover={{
          scale: 1.1
        }}
        whileTap={{
          scale: 0.95
        }}
        style={{
          boxShadow:
          '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)'
        }}>

        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen &&
        <>
            {/* Backdrop for mobile */}
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)} />


            <motion.div
            ref={chatRef}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed z-50 
                bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto
                w-full md:w-96 
                h-[85vh] md:h-[500px] md:max-h-[70vh]
                bg-slate-900/95 backdrop-blur-xl 
                border border-white/10 
                md:rounded-2xl rounded-t-2xl
                shadow-2xl shadow-black/50
                flex flex-col overflow-hidden"








            style={{
              boxShadow:
              '0 0 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.1)'
            }}>

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    E
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Emperial Support
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Online
                    </div>
                  </div>
                </div>
                <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">

                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) =>
              <motion.div
                key={message.id}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>

                    <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${message.isBot ? 'bg-slate-800 text-slate-200 rounded-tl-sm' : 'bg-emperial-500 text-white rounded-tr-sm'}`}>

                      {message.text}
                    </div>
                  </motion.div>
              )}

                {/* Quick Actions - Show only if few messages */}
                {messages.length <= 2 &&
              <div className="pt-2">
                    <p className="text-xs text-slate-500 mb-3">
                      Quick actions:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action) =>
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-white/5 text-left hover:bg-slate-800 hover:border-emperial-500/30 transition-all group">

                          <action.icon className="w-4 h-4 text-emperial-400 group-hover:text-emperial-300" />
                          <span className="text-xs text-slate-300 group-hover:text-white">
                            {action.label}
                          </span>
                        </button>
                  )}
                    </div>
                  </div>
              }
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-slate-800/30">
                <div className="flex items-center gap-2">
                  <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emperial-500 focus:border-transparent" />

                  <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-11 h-11 rounded-xl bg-emperial-500 text-white flex items-center justify-center hover:bg-emperial-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}