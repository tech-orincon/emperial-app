import React, { createContext, useContext } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatContextType {
  openChat: (conversationId?: string) => void;
  openProviderChat: (providerId: string, providerName: string, orderId: string) => void;
  closeChat: () => void;
  isOpen: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType>({
  openChat: () => {},
  openProviderChat: () => {},
  closeChat: () => {},
  isOpen: false,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useChat = () => useContext(ChatContext);

// Note: The ChatProvider is implemented inside ChatCenter.tsx.
// This file defines the context interface and hook for external consumers.
export { ChatContext };
