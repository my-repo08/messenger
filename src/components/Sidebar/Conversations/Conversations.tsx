import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { conversationsState } from "../../../app/atoms/conversationsState";
import { currentConversationState } from "../../../app/atoms/currentConversation";
import { getConversations } from "../../../app/service/conversationsService";
import { auth } from "../../../firebase";
import { formatUser } from "../../../utils";
import ConversationItem from "./ConversationItem/ConversationItem";

const ConversationsList = styled.ul`
  margin-top: 5px;
  margin-bottom: auto;
  padding: 0 13px;
  overflow-y: auto;
`;

interface ConversationsProps {
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const Conversations: React.FC<ConversationsProps> = ({ setIsSibebarOpen }) => {
  const [currentUser] = useAuthState(auth);

  const [conversationsStateValue, setConversationsStateValue] =
    useRecoilState(conversationsState);

  const currentConversationStateValue = useRecoilValue(currentConversationState);

  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    getConversations(currentUser?.uid, setConversationsStateValue);
  }, [currentUser]);

  return (
    <ConversationsList>
      <AnimatePresence>
        {conversationsStateValue.conversations.map((conversation) => {
          const formattedUser = formatUser(conversation, currentUser?.uid!);
          return (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              conversationId={conversationId}
              setConversationId={setConversationId}
              currentUserId={currentUser?.uid}
              user={formattedUser}
              setIsSibebarOpen={setIsSibebarOpen}
              isActive={
                currentConversationStateValue.conversation?.id === conversation.id ? 1 : 0
              }
            />
          );
        })}
      </AnimatePresence>
    </ConversationsList>
  );
};

export default Conversations;
