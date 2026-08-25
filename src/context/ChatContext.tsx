import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatContextType {
  isOpen: boolean
  activeChannelId: string | null
  isMobileListView: boolean
  openChat: (channelId?: string) => void
  openProviderChat: (providerId: string, providerName: string, orderId: string) => void
  closeChat: () => void
  selectConversation: (id: string) => void
  setIsMobileListView: (v: boolean) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextType | null>(null)

// ─── Hook ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useChat(): ChatContextType {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside ChatProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [isMobileListView, setIsMobileListView] = useState(true)

  const openChat = useCallback((channelId?: string) => {
    setIsOpen(true)
    if (channelId) {
      setActiveChannelId(channelId)
      setIsMobileListView(false)
    }
  }, [])

  const openProviderChat = useCallback(
    (_providerId: string, _providerName: string, orderId: string) => {
      openChat(orderId)
    },
    [openChat],
  )

  const closeChat = useCallback(() => setIsOpen(false), [])

  const selectConversation = useCallback((id: string) => {
    setActiveChannelId(id)
    setIsMobileListView(false)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        isOpen, activeChannelId, isMobileListView,
        openChat, openProviderChat, closeChat,
        selectConversation, setIsMobileListView,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
