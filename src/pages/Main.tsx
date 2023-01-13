import { useState } from "react";
import styled from "styled-components";
import ChatWindow from "../components/Chat/ChatWindow/ChatWindow";
import SidebarWrapper from "../components/Sidebar/SidebarWrapper/SidebarWrapper";
import ThemeToggleButton from "../components/ThemeToggleButton";

const MainEl = styled.main`
  height: 100vh;
  display: flex;
  @media (max-width: 768px) {
    height: calc(var(--vh, 1vh) * 100);
  }
`;

const ThemeButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 15px;
`;

interface ChatProps {
  toggleTheme: () => void;
}

const Main: React.FC<ChatProps> = ({ toggleTheme }) => {
  const [isSibebarOpen, setIsSibebarOpen] = useState(true);

  return (
    <MainEl>
      <SidebarWrapper isSibebarOpen={isSibebarOpen} setIsSibebarOpen={setIsSibebarOpen} />
      <ChatWindow isSibebarOpen={isSibebarOpen} setIsSibebarOpen={setIsSibebarOpen} />
      <ThemeButtonWrapper>
        <ThemeToggleButton toggleTheme={toggleTheme} />
      </ThemeButtonWrapper>
    </MainEl>
  );
};

export default Main;
