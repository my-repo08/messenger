import { IoIosArrowBack } from "react-icons/io";
import styled from "styled-components";
import { ConversationInfo } from "../../types";

const HeaderEl = styled.header`
  position: relative;
  padding: 35px 20px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.headerColor};
  border-bottom: 0.5px solid ${(props) => props.theme.headerBorderColor};
  transition: all 0.2s;
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
  transition: all 0.2s;
  cursor: pointer;
  @media (max-width: 768px) {
    display: flex;
  }
`;

const ToUser = styled.span`
  margin-right: 10px;
  opacity: 0.6;
  @media (max-width: 768px) {
    margin-right: 7px;
  }
`;

const ParticipantUser = styled.div`
  position: absolute;
  top: 26px;
  @media (max-width: 768px) {
    margin-left: 35px;
  }
`;

interface HeaderProps {
  conversationInfo: ConversationInfo | null;
  setConversationInfo: (conversationInfo: ConversationInfo | null) => void;
  setIsSibebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  conversationInfo,
  setConversationInfo,
  setIsSibebarOpen,
}) => {
  return (
    <HeaderEl>
      <BackButton
        onClick={() => {
          setConversationInfo(null);
          setIsSibebarOpen(true);
        }}
      >
        <IoIosArrowBack size={20} />
      </BackButton>
      {conversationInfo?.conversationId && (
        <ParticipantUser>
          <ToUser>To:</ToUser>
          {conversationInfo.username}
        </ParticipantUser>
      )}
    </HeaderEl>
  );
};

export default Header;
