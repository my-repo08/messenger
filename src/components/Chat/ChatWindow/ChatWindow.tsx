import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { GiConversation } from "react-icons/gi";
import Messages from "../Messages/Messages";
import Header from "../Header/Header";
import { currentConversationState } from "../../../app/atoms/currentConversation";

const Container = styled.section<{ open: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColorPrimary};
  transition: background-color;
  transition-duration: 0.2s;
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
  transition: color;
  transition-duration: 0.2s;
  user-select: none;
`;

const PlaceholderText = styled.p`
  margin-bottom: 5px;
  font-size: 26px;
`;

interface ChatWindowProps {
  isSibebarOpen: boolean;
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isSibebarOpen, setIsSibebarOpen }) => {
  const currentConversationStateValue = useRecoilValue(currentConversationState);
  return (
    <Container open={isSibebarOpen}>
      <Wrapper>
        <Header setIsSibebarOpen={setIsSibebarOpen} />
        {!currentConversationStateValue.conversation?.id ? (
          <PlaceholderWrapper>
            <GiConversation size={130} />
            <PlaceholderText>No Conversation Selected</PlaceholderText>
            <div>Messages you send or receive will appear here</div>
          </PlaceholderWrapper>
        ) : (
          <Messages />
        )}
      </Wrapper>
    </Container>
  );
};

export default ChatWindow;
