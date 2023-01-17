import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { SetterOrUpdater } from "recoil";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { ConversationsState } from "../atoms/conversationsState";
import { MessagesState } from "./../atoms/messagesState";
import { Conversation, Message, UpdatedConversation } from "../../types";

export const getMessages = async (
  currentConversationId: string,
  setMessagesStateValue: SetterOrUpdater<MessagesState>
) => {
  if (!currentConversationId) {
    return;
  }

  try {
    const q = query(
      collection(db, `messages/${currentConversationId}/conversationMessages`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((item) => ({
        id: item.id,
        conversationId: currentConversationId,
        ...item.data(),
      }));

      setMessagesStateValue((prev) => ({
        messages: {
          ...prev.messages,
          [currentConversationId]: messages as Message[],
        },
      }));
    });

    return () => unsubscribe();
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while receiving messages");
  }
};

export const sendMessage = async (
  messageText: string,
  currentUser: User | null | undefined,
  currentConversation: Conversation,
  setConversationsStateValue: SetterOrUpdater<ConversationsState>
) => {
  let updatedConversation: UpdatedConversation;

  if (currentUser?.uid === currentConversation.creator.uid) {
    updatedConversation = {
      latestMessage: messageText,
      updatedAt: new Date(),
      hasCreatorSeenLatestMessage: true,
      hasParticipantSeenLatestMessage: false,
    };
  } else {
    updatedConversation = {
      latestMessage: messageText,
      updatedAt: new Date(),
      hasCreatorSeenLatestMessage: false,
      hasParticipantSeenLatestMessage: true,
    };
  }

  setConversationsStateValue((prev) => {
    const updatedConversations = [...prev.conversations];
    const updatingConversationIndex = updatedConversations.findIndex(
      (conversation) => conversation.id === currentConversation.id
    );

    const updatingConversation = updatedConversations[updatingConversationIndex];

    updatedConversations[updatingConversationIndex] = {
      ...updatingConversation,
      ...updatedConversation,
      updatedAt: new Date(),
    };
    return {
      conversations: [...updatedConversations],
    };
  });

  const batch = writeBatch(db);

  try {
    batch.set(
      doc(db, `messages/${currentConversation.id}/conversationMessages/${nanoid()}`),
      {
        sender: {
          uid: currentUser?.uid,
          displayName: currentUser?.displayName,
          photoURL: currentUser?.photoURL,
        },
        text: messageText,
        createdAt: serverTimestamp(),
      }
    );

    batch.update(doc(db, `conversations/${currentConversation.id}`), updatedConversation);

    await batch.commit();
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while sending message");
  }
};

export const viewLatestMessage = async (
  currentUserId: string | undefined,
  conversation: Conversation
) => {
  if (!conversation.id) {
    return;
  }

  let lastMessageSeen;
  if (currentUserId === conversation.creator.uid) {
    lastMessageSeen = {
      hasCreatorSeenLatestMessage: true,
    };
  } else if (currentUserId === conversation.participant.uid) {
    lastMessageSeen = {
      hasParticipantSeenLatestMessage: true,
    };
  }

  try {
    await updateDoc(doc(db, `conversations/${conversation.id}`), lastMessageSeen);
  } catch (error) {
    console.log(error as Error);
  }
};
