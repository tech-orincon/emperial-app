import {
  collection, addDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

/**
 * Adds a TEXT message to a channel's messages subcollection
 * and updates the channel's lastMessage metadata.
 */
export async function sendChatMessage(
  channelId: string,
  senderId: string,
  text: string,
): Promise<void> {
  const trimmed = text.trim()
  if (!trimmed) return

  await addDoc(collection(db, 'chat_channels', channelId, 'messages'), {
    senderId,
    type: 'TEXT',
    message: trimmed,
    createdAt: serverTimestamp(),
  })

  await updateDoc(doc(db, 'chat_channels', channelId), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderId,
  })
}
