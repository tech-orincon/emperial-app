import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';

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
  openProviderChat: (providerId: string, providerName: string, orderId: string) => void;
  isOpen: boolean;
}

const ChatContext = createContext<ChatContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openChat: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openProviderChat: () => {},
  isOpen: false,
});

// eslint-disable-next-line react-refresh/only-export-components
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
        timestamp: new Date(),
      },
    ],
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
      { id: '1', text: "Hi! I've been assigned to your Mythic+ 20 order.", isMe: false, timestamp: new Date(Date.now() - 10 * 60000) },
      { id: '2', text: 'Great! When can we start?', isMe: true, timestamp: new Date(Date.now() - 8 * 60000) },
      { id: '3', text: 'Ready to start your run! Are you online?', isMe: false, timestamp: new Date(Date.now() - 5 * 60000) },
    ],
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
      { id: '1', text: 'Starting your Heroic raid now.', isMe: false, timestamp: new Date(Date.now() - 25 * 60 * 60000) },
      { id: '2', text: 'Your raid carry is complete! Thanks for choosing us.', isMe: false, timestamp: new Date(Date.now() - 24 * 60 * 60000) },
    ],
  },
];

const quickActionResponses: Record<string, string> = {
  'Track my order': 'I can help you track your order. Please provide your order number (e.g., EMP-12345).',
  'Ask about a service': "I'd be happy to help with service questions. What would you like to know?",
  'Payment support': 'For payment inquiries, please describe your issue.',
  'Talk to a human': 'Connecting you with a live agent. Average wait time: 2 minutes.',
};

export function ChatCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isMobileListView, setIsMobileListView] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (activeConversationId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [activeConversationId]);

  const markAsRead = (id: string) =>
    setConversations((convs) =>
      convs.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );

  const openChat = (conversationId?: string) => {
    setIsOpen(true);
    if (conversationId) {
      setActiveConversationId(conversationId);
      setIsMobileListView(false);
      markAsRead(conversationId);
    }
  };

  const openProviderChat = (providerId: string, providerName: string, orderId: string) => {
    const existingConv = conversations.find((c) => c.type === 'provider' && c.orderId === orderId);
    if (existingConv) {
      openChat(existingConv.id);
    } else {
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
        messages: [],
      };
      setConversations([...conversations, newConv]);
      setActiveConversationId(newConv.id);
      setIsOpen(true);
      setIsMobileListView(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeConversationId) return;
    const newMessage: Message = { id: Date.now().toString(), text: inputValue, isMe: true, timestamp: new Date() };
    setConversations((convs) =>
      convs.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: inputValue, lastMessageTime: new Date() }
          : c
      )
    );
    setInputValue('');
    if (activeConversationId === 'support') {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! A support agent will review this shortly.',
          isMe: false,
          timestamp: new Date(),
        };
        setConversations((convs) =>
          convs.map((c) =>
            c.id === 'support' ? { ...c, messages: [...c.messages, botResponse], lastMessage: botResponse.text } : c
          )
        );
      }, 1000);
    }
  };

  const handleQuickAction = (action: { label: string; response: string }) => {
    if (activeConversationId !== 'support') return;
    const userMsg: Message = { id: Date.now().toString(), text: action.label, isMe: true, timestamp: new Date() };
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: action.response, isMe: false, timestamp: new Date() };
    setConversations((convs) =>
      convs.map((c) =>
        c.id === 'support' ? { ...c, messages: [...c.messages, userMsg, botMsg], lastMessage: botMsg.text } : c
      )
    );
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsMobileListView(false);
    markAsRead(id);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 1) return 'Just now';
    if (hours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <ChatContext.Provider value={{ openChat, openProviderChat, isOpen }}>
      {/* Floating Button */}
      <motion.button
        onClick={() => openChat()}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emperial-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)' }}>
        <MessageCircle className="w-6 h-6" />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold border-2 border-slate-900">
            {totalUnread}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Center Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed z-50 inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-[480px] lg:w-[600px] bg-slate-900/95 backdrop-blur-xl border border-white/10 md:rounded-2xl shadow-2xl shadow-black/50 flex overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.1)' }}>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              {/* Desktop: Two-column layout */}
              <div className="hidden md:flex w-full">
                <div className="w-[200px] lg:w-[240px] border-r border-white/10 shrink-0">
                  <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={selectConversation}
                    formatTime={formatTime}
                  />
                </div>
                <div className="flex-1">
                  {activeConversation ? (
                    <ChatWindow
                      activeConversation={activeConversation}
                      inputValue={inputValue}
                      onSendMessage={handleSendMessage}
                      onInputChange={setInputValue}
                      onQuickAction={handleQuickAction}
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

              {/* Mobile: Single view with toggle */}
              <div className="md:hidden w-full">
                <AnimatePresence mode="wait">
                  {isMobileListView ? (
                    <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                      <ConversationList
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={selectConversation}
                        formatTime={formatTime}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                      {activeConversation && (
                        <ChatWindow
                          activeConversation={activeConversation}
                          inputValue={inputValue}
                          onSendMessage={handleSendMessage}
                          onInputChange={setInputValue}
                          onQuickAction={handleQuickAction}
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
    </ChatContext.Provider>
  );
}

// Keep backward compatibility
export { ChatCenter as FloatingSupportChat };
