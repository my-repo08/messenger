import { useAuthState } from "react-firebase-hooks/auth";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { currentConversationState } from "../../../app/atoms/currentConversation";
import { auth } from "../../../firebase";
import { formatUser } from "../../../utils";

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

interface HeaderProps {
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSibebarOpen }) => {
  const [currentUser] = useAuthState(auth);

  const [currentConversationStateValue, setCurrentConversationState] = useRecoilState(
    currentConversationState
  );

  return (
    <HeaderEl>
      <BackButton
        onClick={() => {
          setCurrentConversationState(() => ({ conversation: null }));
          setIsSibebarOpen(true);
        }}
      >
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
