import { Conversation } from "../types";

export const setHasLatestMessageSeen = (
  conversation: Conversation,
  currentConversationId: string | undefined,
  currentUserId: string | undefined
) => {
  if (conversation.id === currentConversationId) {
    return;
  }
  if (
    conversation.creator.uid === currentUserId &&
    !conversation.hasCreatorSeenLatestMessage
  ) {
    return true;
  } else if (!conversation.hasParticipantSeenLatestMessage) {
    return true;
  }
};
