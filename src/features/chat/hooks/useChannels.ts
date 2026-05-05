import { useEffect, useState } from 'react'
import {
  collection, query, where, orderBy, onSnapshot,
} from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import type { ChatChannel } from '../types/chat.types'

export function useChannels(uid: string | null) {
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!uid) {
      setChannels([])
      return
    }
    setIsLoading(true)

    const q = query(
      collection(db, 'chat_channels'),
      where('participants', 'array-contains', uid),
      orderBy('lastMessageAt', 'desc'),
    )

    return onSnapshot(
      q,
      (snap) => {
        setChannels(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ChatChannel))
        setIsLoading(false)
      },
      (error) => {
        console.error("Firestore error:", error)
        setIsLoading(false)
      }
    )
  }, [uid])

  return { channels, isLoading }
}
