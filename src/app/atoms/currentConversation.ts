import { atom } from "recoil";
import { Conversation } from "../../types";

export interface CurrentConversationState {
  conversation: Conversation | null;
}

const defaultCurrentConversationState: CurrentConversationState = {
  conversation: null,
};

export const currentConversationState = atom<CurrentConversationState>({
  key: "currentConversationState",
  default: defaultCurrentConversationState,
});
