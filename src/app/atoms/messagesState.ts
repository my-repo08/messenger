import { atom } from "recoil";
import { Message } from "../../types";

export interface MessagesState {
  messages: {
    [conversationId: string]: Message[];
  };
}

const defaultMessagesState: MessagesState = {
  messages: {},
};

export const messagesState = atom<MessagesState>({
  key: "messagesState",
  default: defaultMessagesState,
});
