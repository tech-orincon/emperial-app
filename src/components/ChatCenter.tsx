import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  Component } from
'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  ChevronLeft,
  Package,
  HelpCircle,
  CreditCard,
  User,
  Shield,
  Search,
  MoreVertical } from
'lucide-react';
import { Toaster, toast } from 'sonner';
// Types
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
// Chat Context for global access
interface ChatContextType {
  openChat: (conversationId?: string) => void;
  openProviderChat: (
  providerId: string,
  providerName: string,
  orderId: string)
  => void;
  isOpen: boolean;
}
const ChatContext = createContext<ChatContextType>({
  openChat: () => {},
  openProviderChat: () => {},
  isOpen: false
});
export const useChat = () => useContext(ChatContext);
// Mock conversations data
const initialConversations: Conversation[] = [
{
  id: 'support',
  type: 'support',
  name: 'Emperial Support',
  avatar: 'E',
  isOnline: true,
  unreadCount: 1,
  lastMessage: 'Welcome to Emperial Boosting Support!',
  lastMessageTime: new Date(),
  messages: [
  {
    id: '1',
    text: 'Welcome to Emperial Boosting Support. How can we help you today?',
    isMe: false,
    timestamp: new Date()
  }]

},
{
  id: 'provider-shadowblade-EMP-12345',
  type: 'provider',
  name: 'Shadowblade',
  avatar: 'SB',
  orderId: 'EMP-12345',
  isOnline: true,
  unreadCount: 2,
  lastMessage: 'Ready to start your run! Are you online?',
  lastMessageTime: new Date(Date.now() - 5 * 60000),
  messages: [
  {
    id: '1',
    text: "Hi! I've been assigned to your Mythic+ 20 order.",
    isMe: false,
    timestamp: new Date(Date.now() - 10 * 60000)
  },
  {
    id: '2',
    text: 'Great! When can we start?',
    isMe: true,
    timestamp: new Date(Date.now() - 8 * 60000)
  },
  {
    id: '3',
    text: 'Ready to start your run! Are you online?',
    isMe: false,
    timestamp: new Date(Date.now() - 5 * 60000)
  }]

},
{
  id: 'provider-frostmage-EMP-12346',
  type: 'provider',
  name: 'Frostmage',
  avatar: 'FM',
  orderId: 'EMP-12346',
  isOnline: false,
  unreadCount: 0,
  lastMessage: 'Your raid carry is complete! Thanks for choosing us.',
  lastMessageTime: new Date(Date.now() - 24 * 60 * 60000),
  messages: [
  {
    id: '1',
    text: 'Starting your Heroic raid now.',
    isMe: false,
    timestamp: new Date(Date.now() - 25 * 60 * 60000)
  },
  {
    id: '2',
    text: 'Your raid carry is complete! Thanks for choosing us.',
    isMe: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60000)
  }]

}];

// Quick actions for support chat
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
  "I'd be happy to help with service questions. What would you like to know?"
},
{
  icon: CreditCard,
  label: 'Payment support',
  response: 'For payment inquiries, please describe your issue.'
},
{
  icon: User,
  label: 'Talk to a human',
  response: 'Connecting you with a live agent. Average wait time: 2 minutes.'
}];

export function ChatCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] =
  useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null>(
    null);
  const [inputValue, setInputValue] = useState('');
  const [isMobileListView, setIsMobileListView] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [activeConversation?.messages]);
  // Focus input when conversation selected
  useEffect(() => {
    if (activeConversationId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeConversationId]);
  const openChat = (conversationId?: string) => {
    setIsOpen(true);
    if (conversationId) {
      setActiveConversationId(conversationId);
      setIsMobileListView(false);
      // Mark as read
      setConversations((convs) =>
      convs.map((c) =>
      c.id === conversationId ?
      {
        ...c,
        unreadCount: 0
      } :
      c
      )
      );
    }
  };
  const openProviderChat = (
  providerId: string,
  providerName: string,
  orderId: string) =>
  {
    const existingConv = conversations.find(
      (c) => c.type === 'provider' && c.orderId === orderId
    );
    if (existingConv) {
      openChat(existingConv.id);
    } else {
      // Create new conversation
      const newConv: Conversation = {
        id: `provider-${providerId}-${orderId}`,
        type: 'provider',
        name: providerName,
        avatar: providerName.substring(0, 2).toUpperCase(),
        orderId,
        isOnline: true,
        unreadCount: 0,
        lastMessage: 'Start a conversation...',
        lastMessageTime: new Date(),
        messages: []
      };
      setConversations([...conversations, newConv]);
      setActiveConversationId(newConv.id);
      setIsOpen(true);
      setIsMobileListView(false);
    }
  };
  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeConversationId) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isMe: true,
      timestamp: new Date()
    };
    setConversations((convs) =>
    convs.map((c) => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: inputValue,
          lastMessageTime: new Date()
        };
      }
      return c;
    })
    );
    setInputValue('');
    // Simulate response for support chat
    if (activeConversationId === 'support') {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! A support agent will review this shortly.',
          isMe: false,
          timestamp: new Date()
        };
        setConversations((convs) =>
        convs.map((c) => {
          if (c.id === 'support') {
            return {
              ...c,
              messages: [...c.messages, botResponse],
              lastMessage: botResponse.text
            };
          }
          return c;
        })
        );
      }, 1000);
    }
  };
  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    if (activeConversationId !== 'support') return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: action.label,
      isMe: true,
      timestamp: new Date()
    };
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: action.response,
      isMe: false,
      timestamp: new Date()
    };
    setConversations((convs) =>
    convs.map((c) => {
      if (c.id === 'support') {
        return {
          ...c,
          messages: [...c.messages, userMsg, botMsg],
          lastMessage: botMsg.text
        };
      }
      return c;
    })
    );
  };
  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsMobileListView(false);
    setConversations((convs) =>
    convs.map((c) =>
    c.id === id ?
    {
      ...c,
      unreadCount: 0
    } :
    c
    )
    );
  };
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 1) return 'Just now';
    if (hours < 24)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };
  // Conversation List Component
  const ConversationList = () =>
  <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-white text-lg mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
          type="text"
          placeholder="Search conversations..."
          className="w-full bg-slate-800 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emperial-500" />
        
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Support Chat - Pinned */}
        {conversations.
      filter((c) => c.type === 'support').
      map((conv) =>
      <motion.button
        key={conv.id}
        onClick={() => selectConversation(conv.id)}
        className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${activeConversationId === conv.id ? 'bg-emperial-500/10' : ''}`}
        whileTap={{
          scale: 0.98
        }}>
        
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emperial-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {conv.avatar}
                </div>
                {conv.isOnline &&
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-900" />
          }
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
                <p className="text-sm text-slate-400 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCount > 0 &&
        <span className="shrink-0 w-5 h-5 rounded-full bg-emperial-500 text-white text-xs flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
        }
            </motion.button>
      )}

        {/* Provider Chats */}
        {conversations.filter((c) => c.type === 'provider').length > 0 &&
      <div className="px-4 py-2 bg-slate-800/30">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Provider Chats
            </span>
          </div>
      }
        {conversations.
      filter((c) => c.type === 'provider').
      map((conv) =>
      <motion.button
        key={conv.id}
        onClick={() => selectConversation(conv.id)}
        className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${activeConversationId === conv.id ? 'bg-purple-500/10' : ''}`}
        whileTap={{
          scale: 0.98
        }}>
        
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                  {conv.avatar}
                </div>
                {conv.isOnline &&
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-900" />
          }
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{conv.name}</span>
                  <span className="text-xs text-slate-500">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs text-purple-400 mb-0.5">
                  Order #{conv.orderId}
                </p>
                <p className="text-sm text-slate-400 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unreadCount > 0 &&
        <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
        }
            </motion.button>
      )}
      </div>
    </div>;

  // Chat Window Component
  const ChatWindow = () => {
    if (!activeConversation) return null;
    const isSupport = activeConversation.type === 'support';
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-slate-800/50">
          <button
            onClick={() => setIsMobileListView(true)}
            className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg">
            
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="relative shrink-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${isSupport ? 'bg-gradient-to-br from-emperial-500 to-purple-600' : 'bg-gradient-to-br from-purple-500 to-pink-600'}`}>
              
              {activeConversation.avatar}
            </div>
            {activeConversation.isOnline &&
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm flex items-center gap-1">
              {activeConversation.name}
              {isSupport && <Shield className="w-3 h-3 text-emperial-400" />}
            </h3>
            {activeConversation.orderId ?
            <p className="text-xs text-purple-400">
                Order #{activeConversation.orderId}
              </p> :

            <p className="text-xs text-slate-400 flex items-center gap-1">
                {activeConversation.isOnline ?
              <>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Online
                  </> :

              'Offline'
              }
              </p>
            }
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeConversation.messages.map((message) =>
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
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
            
              <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${message.isMe ? 'bg-emperial-500 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
              
                {message.text}
              </div>
            </motion.div>
          )}

          {/* Quick Actions for Support */}
          {isSupport && activeConversation.messages.length <= 2 &&
          <div className="pt-2">
              <p className="text-xs text-slate-500 mb-3">Quick actions:</p>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-slate-800/30">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emperial-500" />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-11 h-11 rounded-xl bg-emperial-500 text-white flex items-center justify-center hover:bg-emperial-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>);

  };
  return (
    <ChatContext.Provider
      value={{
        openChat,
        openProviderChat,
        isOpen
      }}>
      
      {/* Floating Button */}
      <motion.button
        onClick={() => openChat()}
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
        {totalUnread > 0 &&
        <motion.span
          initial={{
            scale: 0
          }}
          animate={{
            scale: 1
          }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold border-2 border-slate-900">
          
            {totalUnread}
          </motion.span>
        }
      </motion.button>

      {/* Chat Center Panel */}
      <AnimatePresence>
        {isOpen &&
        <>
            {/* Backdrop */}
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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)} />
          

            {/* Panel */}
            <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            exit={{
              opacity: 0,
              x: 20
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="fixed z-50 
                inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4
                md:w-[480px] lg:w-[600px]
                bg-slate-900/95 backdrop-blur-xl 
                border border-white/10 
                md:rounded-2xl
                shadow-2xl shadow-black/50
                flex overflow-hidden"







            style={{
              boxShadow:
              '0 0 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.1)'
            }}>
            
              {/* Close button */}
              <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              
                <X className="w-4 h-4" />
              </button>

              {/* Desktop: Two-column layout */}
              <div className="hidden md:flex w-full">
                {/* Left: Conversation List */}
                <div className="w-[200px] lg:w-[240px] border-r border-white/10 shrink-0">
                  <ConversationList />
                </div>
                {/* Right: Chat Window */}
                <div className="flex-1">
                  {activeConversation ?
                <ChatWindow /> :

                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-400">
                        Select a conversation to start chatting
                      </p>
                    </div>
                }
                </div>
              </div>

              {/* Mobile: Single view with toggle */}
              <div className="md:hidden w-full">
                <AnimatePresence mode="wait">
                  {isMobileListView ?
                <motion.div
                  key="list"
                  initial={{
                    opacity: 0,
                    x: -20
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: -20
                  }}
                  className="h-full">
                  
                      <ConversationList />
                    </motion.div> :

                <motion.div
                  key="chat"
                  initial={{
                    opacity: 0,
                    x: 20
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: 20
                  }}
                  className="h-full">
                  
                      <ChatWindow />
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </ChatContext.Provider>);

}
// Keep backward compatibility
export { ChatCenter as FloatingSupportChat };