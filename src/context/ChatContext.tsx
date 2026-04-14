import { createContext, useContext } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatContextType {
  openChat: (conversationId?: string) => void;
  openProviderChat: (providerId: string, providerName: string, orderId: string) => void;
  closeChat: () => void;
  isOpen: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openChat: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openProviderChat: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  closeChat: () => {},
  isOpen: false,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);

// Note: The ChatProvider is implemented inside ChatCenter.tsx.
// This file defines the context interface and hook for external consumers.
export { ChatContext };
