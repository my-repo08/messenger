import { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { conversationsState } from "../../../../app/atoms/conversationsState";
import { currentConversationState } from "../../../../app/atoms/currentConversation";
import { sendMessage } from "../../../../app/service/messagesService";
import { auth } from "../../../../firebase";

const Form = styled.form`
  position: relative;
  width: 100%;
  display: flex;
  padding: 10px;
  padding-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  background: transparent;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  border: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  border-radius: 15px;
  transition: color, border;
  transition-duration: 0.2s;
  outline: none;
  :focus {
    border-color: ${(props) => props.theme.inputBorderColor};
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SendButton = styled.button`
  display: flex;
  position: absolute;
  top: 15px;
  right: 20px;
  color: #3d84f7;
  background: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  :disabled {
    cursor: not-allowed;
  }
`;

const MessageInput: React.FC = () => {
  const [currentUser] = useAuthState(auth);

  const currentConversationStateValue = useRecoilValue(currentConversationState);
  const setConversationsStateValue = useSetRecoilState(conversationsState);

  const messageTextRef = useRef<HTMLInputElement | null>(null);

  const onSendMessage = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!messageTextRef.current?.value.trim()) {
      if (messageTextRef.current) {
        messageTextRef.current.value = "";
        messageTextRef.current.focus();
      }
      return;
    }
    if (!currentConversationStateValue.conversation) {
      return;
    }
    const messageText = messageTextRef.current.value;
    messageTextRef.current.value = "";
    sendMessage(
      messageText,
      currentUser,
      currentConversationStateValue.conversation,
      setConversationsStateValue
    );
  };

  return (
    <Form onSubmit={onSendMessage}>
      <Input type="text" maxLength={3000} ref={messageTextRef} />
      <SendButton type="submit">
        <BsFillArrowUpCircleFill size={24} />
      </SendButton>
    </Form>
  );
};

export default MessageInput;
