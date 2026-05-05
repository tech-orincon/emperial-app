import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import type { ChatMessage } from '../types/chat.types'

export function useMessages(channelId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!channelId) {
      setMessages([])
      return
    }
    setIsLoading(true)
    const q = query(
      collection(db, 'chat_channels', channelId, 'messages'),
      orderBy('createdAt', 'asc'),
    )
    return onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ChatMessage))
        setIsLoading(false)
      },
      () => setIsLoading(false),
    )
  }, [channelId])

  return { messages, isLoading }
}
