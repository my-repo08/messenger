import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { BiDotsVerticalRounded } from "react-icons/bi";
import MoreMenu from "./MoreMenu";
import { formatAvatar, formatTimestamp, formatUsername, setBadge } from "../../utils";
import { auth, db } from "../../firebase/firebase";
import { Conversation, ConversationInfo } from "../../types";

const ConversationsList = styled.ul`
  margin-top: 10px;
  margin-bottom: auto;
  padding: 0 13px;
  overflow-y: auto;
`;

const ConversationItem = styled(motion.li)<{ active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 15px 10px;
  padding-left: 18px;
  color: ${(props) => (props.active ? "white" : props.theme.textColor)};
  background-color: ${(props) => (props.active ? "#3478f6" : "")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  :hover:not(:has(.child)) {
    background-color: ${(props) => (props.active ? "" : props.theme.bgColorHover)};
  }
`;

const UsernameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Username = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const Datetime = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin-left: auto;
  font-size: 12px;
`;

const LatestMessage = styled.span`
  max-width: 220px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.8;
  @media (max-width: 768px) {
    max-width: 270px;
  }
`;

const MoreButton = styled.button<{ active: boolean }>`
  position: absolute;
  top: 1px;
  right: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  color: ${(props) => (props.active ? "white" : props.theme.textColor)};
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const BottomBorder = styled.span`
  display: none;
  @media (max-width: 768px) {
    position: relative;
    bottom: 0.5px;
    display: block;
    margin-left: 69px;
    border-bottom: 0.5px solid ${(props) => props.theme.borderColorPrimary};
    transition: all 0.2s;
  }
`;

interface ConversationsProps {
  conversationInfo: ConversationInfo | null;
  setConversationInfo: (conversationInfo: ConversationInfo | null) => void;
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const Conversations: React.FC<ConversationsProps> = ({
  conversationInfo,
  setConversationInfo,
  setIsSibebarOpen,
}) => {
  const [currentUser] = useAuthState(auth);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState("");

  const onSetConversationId = (evt: React.MouseEvent<HTMLButtonElement>, id: string) => {
    evt.stopPropagation();
    if (conversationId === id) {
      setConversationId("");
    } else {
      setConversationId(id);
    }
  };

  const onViewConversation = (conversationInfo: ConversationInfo) => {
    if (conversationId) {
      setConversationId("");
      return;
    }
    setConversationInfo({
      conversationId: conversationInfo.conversationId,
      username: conversationInfo.username,
      creatorId: conversationInfo.creatorId,
      participantId: conversationInfo.participantId,
    });
    setIsSibebarOpen(false);
  };

  const getConversations = () => {
    try {
      const q = query(collection(db, "conversations"), orderBy("updatedAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const myConversations = querySnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Conversation[];
        const filteredConversations = myConversations.filter(
          (conversation) =>
            conversation.creator.uid === currentUser?.uid ||
            conversation.participant.uid === currentUser?.uid
        );
        setConversations(filteredConversations as Conversation[]);
      });
      return () => unsubscribe();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getConversations();
  }, [currentUser]);

  return (
    <ConversationsList>
      <AnimatePresence>
        {conversations?.map((conversation) => {
          const formattedUser = formatUsername(conversation, currentUser?.uid!);
          return (
            <>
              <ConversationItem
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.3, x: -200 }}
                transition={{ duration: 0.1 }}
                key={conversation.id}
                active={conversationInfo?.conversationId === conversation.id}
                onClick={() =>
                  onViewConversation({
                    conversationId: conversation.id,
                    username: formattedUser.displayName!,
                    creatorId: conversation.creator.uid,
                    participantId: conversation.participant.uid,
                  })
                }
              >
                {setBadge(conversation, currentUser?.uid!)}
                {formatAvatar(formattedUser)}
                <UsernameWrapper>
                  <Username>{formattedUser.displayName}</Username>
                  <LatestMessage>{conversation.latestMessage}</LatestMessage>
                </UsernameWrapper>
                <Datetime>{formatTimestamp(conversation.updatedAt)}</Datetime>
                <MoreButton
                  active={conversationInfo?.conversationId === conversation.id}
                  onClick={(evt) => onSetConversationId(evt, conversation.id)}
                >
                  <BiDotsVerticalRounded size={17} />
                </MoreButton>
                <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
                  {conversation.id === conversationId && (
                    <MoreMenu
                      conversationId={conversationId}
                      setConversationInfo={setConversationInfo}
                    />
                  )}
                </AnimatePresence>
              </ConversationItem>
              <BottomBorder />
            </>
          );
        })}
      </AnimatePresence>
    </ConversationsList>
  );
};

export default Conversations;
