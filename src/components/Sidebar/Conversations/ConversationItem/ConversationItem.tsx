import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { currentConversationState } from "../../../../app/atoms/currentConversation";
import { ChatUser, Conversation } from "../../../../types";
import { formatAvatar, formatTimestamp, setBadge } from "../../../../utils";
import MoreMenu from "../MoreMenu/MoreMenu";

const ConversationEl = styled(motion.li)<{ active: boolean }>`
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
  transition: color, background-color;
  transition-duration: 0.2s;
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
  max-width: 230px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.8;
  @media (max-width: 768px) {
    max-width: 65vw;
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
  transition: color;
  transition-duration: 0.2s;
  cursor: pointer;
`;

const BottomBorder = styled.span`
  display: none;
  @media (max-width: 768px) {
    position: relative;
    bottom: 0.5px;
    display: block;
    margin-left: 69px;
    margin-right: 9px;
    border-bottom: 0.5px solid ${(props) => props.theme.borderColorPrimary};
    transition: border;
    transition-duration: 0.2s;
  }
`;

interface ConversationItemProps {
  conversation: Conversation;
  conversationId: string | null;
  setConversationId: (conversationId: string | null) => void;
  currentUserId: string | undefined;
  user: ChatUser;
  setIsSibebarOpen: (isOpen: boolean) => void;
  isActive: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  conversationId,
  setConversationId,
  currentUserId,
  user,
  setIsSibebarOpen,
  isActive,
}) => {
  const setCurrentConversationState = useSetRecoilState(currentConversationState);

  const onSetConversationId = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id: string | null
  ) => {
    evt.stopPropagation();
    if (conversationId === id) {
      setConversationId(null);
    } else {
      setConversationId(id);
    }
  };

  const onViewConversation = (conversation: Conversation) => {
    if (conversationId) {
      setConversationId(null);
      return;
    }
    setCurrentConversationState(() => ({ conversation: conversation }));
    setIsSibebarOpen(false);
  };

  return (
    <div>
      <ConversationEl
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: -500 }}
        transition={{ duration: 0.2 }}
        active={isActive}
        onClick={() => onViewConversation(conversation)}
      >
        {setBadge(conversation, currentUserId)}
        {formatAvatar(user)}
        <UsernameWrapper>
          <Username>{user.displayName}</Username>
          <LatestMessage>{conversation.latestMessage}</LatestMessage>
        </UsernameWrapper>
        <Datetime>{formatTimestamp(conversation.updatedAt)}</Datetime>
        <MoreButton
          active={isActive}
          onClick={(evt) => onSetConversationId(evt, conversation.id as string)}
        >
          <BiDotsVerticalRounded size={17} />
        </MoreButton>
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
          {conversation.id === conversationId && (
            <MoreMenu conversationId={conversationId} />
          )}
        </AnimatePresence>
      </ConversationEl>
      <BottomBorder />
    </div>
  );
};

export default ConversationItem;
