import styled from "styled-components";
import { motion } from "framer-motion";
import { AiFillDelete } from "react-icons/ai";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState } from "react";
import { ConversationInfo } from "../../types";

const MoreMenuEl = styled(motion.div)`
  position: absolute;
  top: 3px;
  right: 25px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.menuBgColor};
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.borderColor};
`;

const DeleteItem = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 2px 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  :not(:disabled) {
    :hover {
      background-color: ${(props) => props.theme.bgColorHover};
    }
  }
  :disabled {
    cursor: not-allowed;
  }
`;

const VARIANTS = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
  },
  exit: {
    scale: 0,
  },
};

interface MoreMenuProps {
  conversationId: string;
  setConversationInfo: (conversationInfo: ConversationInfo) => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ conversationId, setConversationInfo }) => {
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);

  const onDeleteConversation = async () => {
    if (!conversationId) {
      return;
    }
    setIsDeletingLoading(true);
    const batch = writeBatch(db);
    try {
      batch.delete(doc(db, "conversations", conversationId));
      await batch.commit();
      setConversationInfo({
        conversationId: "",
        creatorId: "",
        participantId: "",
        username: "",
      });
    } catch (error: any) {
      console.log(error.message);
    }
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
