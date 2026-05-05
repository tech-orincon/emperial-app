import type { Timestamp } from 'firebase/firestore'

export type ChannelStatus =
  | 'PENDING' | 'PAID' | 'QUEUED' | 'ACCEPTED'
  | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'

// ─── Firestore DTOs ───────────────────────────────────────────────────────────

export interface ChatChannel {
  id: string            // = orderId as string (channelId)
  orderId: number
  buyerId: string
  providerId: string
  participants: string[]
  lastMessage: string
  lastMessageAt: Timestamp | null
  lastSenderId: string
  status: ChannelStatus
}

export interface ChatMessage {
  id: string
  senderId: string
  type: 'TEXT' | 'SYSTEM'
  message: string
  createdAt: Timestamp | null
}

// ─── UI-mapped types (passed to components) ───────────────────────────────────

export interface UiConversation {
  id: string
  name: string
  avatar: string
  orderId: number
  status: ChannelStatus
  lastMessage: string
  lastMessageAt: Date | null
  isUnread: boolean
}

export interface UiMessage {
  id: string
  text: string
  isMe: boolean
  isSystem: boolean
  timestamp: Date | null
}
