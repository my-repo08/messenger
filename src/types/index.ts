import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type ChatUser = Pick<User, "uid" | "displayName" | "photoURL">;

export interface Conversation {
  id: string;
  creator: ChatUser;
  participant: ChatUser;
  latestMessage: string;
  hasCreatorSeenLatestMessage: boolean;
  hasParticipantSeenLatestMessage: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConversationInfo {
  username: string;
  conversationId: string;
  creatorId: string;
  participantId: string;
}

export interface Message {
  id: string;
  sender: ChatUser;
  text: string;
  createdAt: Timestamp;
}
