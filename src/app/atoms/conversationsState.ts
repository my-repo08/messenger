import { atom } from "recoil";
import { Conversation } from "../../types";

export interface ConversationsState {
  conversations: Conversation[];
}

const defaultConversationsState: ConversationsState = {
  conversations: [],
};

export const conversationsState = atom<ConversationsState>({
  key: "conversationsState",
  default: defaultConversationsState,
});
