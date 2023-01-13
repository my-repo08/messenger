import { Conversation } from "../types";

const formatUser = (conversation: Conversation, currentUserId: string | undefined) => {
  return conversation.creator.uid === currentUserId
    ? conversation.participant
    : conversation.creator;
};

export default formatUser;
