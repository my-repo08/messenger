import { motion } from "framer-motion";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentConversationState } from "../../../../app/atoms/currentConversation";
import { deleteConversation } from "../../../../app/service/conversationsService";

const MoreMenuEl = styled(motion.div)`
  position: absolute;
  top: -2px;
  right: 28px;
  width: 100px;
  padding: 5px 0;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.menuBgColor};
  border-radius: 5px;
  border: 0.5px solid ${(props) => props.theme.borderColor};
  transition: color, background-color, border;
  transition-duration: 0.2s;
  @media (max-width: 768px) {
    top: -2px;
    width: 90px;
  }
`;

const DeleteItem = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 1px 8px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  background-color: transparent;
  border: none;
  transition: color, background-color;
  transition-duration: 0.2s;
  cursor: pointer;
  :not(:disabled) {
    :hover {
      background-color: ${(props) => props.theme.bgColorHover};
    }
  }
  :disabled {
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const VARIANTS = {
  hidden: {
    scale: 0.3,
  },
  visible: {
    scale: 1,
  },
  exit: {
    scale: 0.3,
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

interface MoreMenuProps {
  conversationId: string;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ conversationId }) => {
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);

  const setCurrentConversationStateValue = useSetRecoilState(currentConversationState);

  const onDeleteConversation = async () => {
    if (!conversationId) {
      return;
    }
    setIsDeletingLoading(true);
    await deleteConversation(conversationId, setCurrentConversationStateValue);
    setIsDeletingLoading(false);
  };

  return (
    <MoreMenuEl
      className="child"
      variants={VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <DeleteItem onClick={onDeleteConversation} disabled={isDeletingLoading}>
        Delete
        <AiFillDelete />
      </DeleteItem>
    </MoreMenuEl>
  );
};

export default MoreMenu;
