import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export type Profile = {
  displayName: string | null;
  photoURL: string | null;
};

export type ChatUser = Pick<User, "uid" | "displayName" | "photoURL">;

export type UpdatedConversation = Pick<
  Conversation,
  | "latestMessage"
  | "updatedAt"
  | "hasCreatorSeenLatestMessage"
  | "hasParticipantSeenLatestMessage"
>;

export interface Conversation {
  id?: string;
  creator: ChatUser;
  participant: ChatUser;
  latestMessage: string;
  hasCreatorSeenLatestMessage: boolean;
  hasParticipantSeenLatestMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: ChatUser;
  text: string;
  createdAt: Timestamp;
}
