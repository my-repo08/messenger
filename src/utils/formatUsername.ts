import { Conversation } from "../types";

const formatUsername = (conversation: Conversation, currentUserId: string) => {
  return conversation.creator.uid === currentUserId
    ? conversation.participant
    : conversation.creator;
};

export default formatUsername;
