import { useState } from "react";
import styled from "styled-components";
import ChatWindow from "../components/Chat/ChatWindow";
import SidebarWrapper from "../components/Sidebar/SidebarWrapper";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { ConversationInfo } from "../types";

const MainEl = styled.main`
  height: 100vh;
  display: flex;
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
  const [conversationInfo, setConversationInfo] = useState<ConversationInfo | null>(null);

  const [isSibebarOpen, setIsSibebarOpen] = useState(true);

  return (
    <MainEl>
      <SidebarWrapper
        conversationInfo={conversationInfo}
        setConversationInfo={setConversationInfo}
        isSibebarOpen={isSibebarOpen}
        setIsSibebarOpen={setIsSibebarOpen}
      />
      <ChatWindow
        conversationInfo={conversationInfo}
        setConversationInfo={setConversationInfo}
        isSibebarOpen={isSibebarOpen}
        setIsSibebarOpen={setIsSibebarOpen}
      />
      <ThemeButtonWrapper>
        <ThemeToggleButton toggleTheme={toggleTheme} />
      </ThemeButtonWrapper>
    </MainEl>
  );
};

export default Main;
