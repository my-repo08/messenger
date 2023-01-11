import styled from "styled-components";
import { GiConversation } from "react-icons/gi";
import Messages from "./Messages";
import Header from "./Header";
import { ConversationInfo } from "../../types";

const Container = styled.section<{ open: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColorPrimary};
  transition: all 0.2s;
  @media (max-width: 768px) {
    display: ${(props) => (props.open ? "none" : "flex")};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const PlaceholderWrapper = styled.div`
  margin: auto 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.textColor};
  transition: all 0.2s;
  user-select: none;
`;

const PlaceholderText = styled.p`
  margin-bottom: 5px;
  font-size: 26px;
`;

interface ChatWindowProps {
  conversationInfo: ConversationInfo | null;
  setConversationInfo: (conversationInfo: ConversationInfo | null) => void;
  isSibebarOpen: boolean;
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationInfo,
  setConversationInfo,
  isSibebarOpen,
  setIsSibebarOpen,
}) => {
  return (
    <Container open={isSibebarOpen}>
      <Wrapper>
        <Header
          conversationInfo={conversationInfo}
          setConversationInfo={setConversationInfo}
          setIsSibebarOpen={setIsSibebarOpen}
        />
        {!conversationInfo?.conversationId ? (
          <PlaceholderWrapper>
            <GiConversation size={130} />
            <PlaceholderText>No Conversation Selected</PlaceholderText>
            <div>Messages you send or receive will appear here</div>
          </PlaceholderWrapper>
        ) : (
          <Messages conversationInfo={conversationInfo} />
        )}
      </Wrapper>
    </Container>
  );
};

export default ChatWindow;
