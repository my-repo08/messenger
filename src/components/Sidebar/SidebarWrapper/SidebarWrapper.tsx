import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Conversations from "../Conversations/Conversations";
import SearchUsers from "../SearchUsers/SearchUsers";
import UserInfo from "../UserInfo/UserInfo";
import UserModal from "../UserModal/UserModal";
import { auth } from "../../../firebase";

const Container = styled.section<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  width: 380px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColorSecondary};
  border-right: 0.5px solid ${(props) => props.theme.borderColorSecondary};
  transition: color, background-color, border;
  transition-duration: 0.2s;
  @media (max-width: 768px) {
    width: ${(props) => (props.open ? "100%" : "")};
    display: ${(props) => (props.open ? "flex" : "none")};
  }
  @media (min-width: 769px) {
    display: flex;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  overflow: hidden;
`;

interface SidebarProps {
  isSibebarOpen: boolean;
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSibebarOpen, setIsSibebarOpen }) => {
  const [currentUser] = useAuthState(auth);

  const [isUserModalOpen, setIsUserModalOpen] = useState(!currentUser?.displayName);

  return (
    <Container open={isSibebarOpen}>
      <Wrapper>
        <SearchUsers />
        <Conversations setIsSibebarOpen={setIsSibebarOpen} />
      </Wrapper>
      <UserInfo />
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isUserModalOpen && <UserModal setOpen={setIsUserModalOpen} />}
      </AnimatePresence>
    </Container>
  );
};

export default Sidebar;
