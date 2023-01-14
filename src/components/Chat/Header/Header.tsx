import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { conversationsState } from "../../../app/atoms/conversationsState";
import { currentConversationState } from "../../../app/atoms/currentConversation";
import { auth } from "../../../firebase";
import { formatUser } from "../../../utils";
import { setHasLatestMessageSeen } from "../../../utils/setHasLatestMessageSeen";

const HeaderEl = styled.header`
  position: relative;
  padding: 35px 20px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.headerBgColor};
  border-bottom: 0.5px solid ${(props) => props.theme.headerBorderColor};
  transition: color, background-color, border;
  transition-duration: 0.2s;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 15px;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 5px;
  padding-right: 7px;
  color: ${(props) => props.theme.textColor};
  background-color: transparent;
  border: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  border-radius: 8px;
  transition: color, border;
  transition-duration: 0.2s;
  cursor: pointer;
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ToParticipant = styled.span`
  margin-right: 10px;
  opacity: 0.6;
  @media (max-width: 768px) {
    margin-right: 7px;
  }
`;

const Participant = styled.div`
  position: absolute;
  top: 26px;
  @media (max-width: 768px) {
    margin-left: 35px;
  }
`;

const NumberOfMsg = styled.span`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: white;
  background-color: #3478f6;
  border-radius: 50%;
  @media (min-width: 768px) {
    display: none;
  }
`;

interface HeaderProps {
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSibebarOpen }) => {
  const [currentUser] = useAuthState(auth);

  const [currentConversationStateValue, setCurrentConversationState] = useRecoilState(
    currentConversationState
  );

  const conversationStateValue = useRecoilValue(conversationsState);

  const numberOfUnseenLatestMessages = conversationStateValue.conversations.filter(
    (conversation) =>
      setHasLatestMessageSeen(
        conversation,
        currentConversationStateValue.conversation?.id,
        currentUser?.uid
      )
  ).length;

  return (
    <HeaderEl>
      <BackButton
        onClick={() => {
          setCurrentConversationState(() => ({ conversation: null }));
          setIsSibebarOpen(true);
        }}
      >
        {numberOfUnseenLatestMessages > 0 && (
          <NumberOfMsg>{numberOfUnseenLatestMessages}</NumberOfMsg>
        )}
        <IoIosArrowBack size={20} />
      </BackButton>
      {currentConversationStateValue.conversation?.id && (
        <Participant>
          <ToParticipant>To:</ToParticipant>
          {
            formatUser(currentConversationStateValue.conversation, currentUser?.uid)
              .displayName
          }
        </Participant>
      )}
    </HeaderEl>
  );
};

export default Header;
