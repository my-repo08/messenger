import dayjs from "dayjs";
import styled from "styled-components";
import { Message } from "../../../../types";

const MessageWrapper = styled.li<{ sentByMe: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.sentByMe ? "flex-end" : "flex-start")};
  padding: 5px 10px;
  color: ${(props) => props.theme.textColor};
  transition: color;
  transition-duration: 0.2s;
`;

const MessageEl = styled.div`
  max-width: 40%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    max-width: 60%;
  }
`;

const MessageText = styled.p<{ sentByMe: boolean }>`
  align-self: center;
  padding: 7px 10px;
  font-size: 14px;
  color: ${(props) => (props.sentByMe ? "white" : "")};
  background-color: ${(props) => (props.sentByMe ? "#3478f6" : props.theme.bgColorHover)};
  border-radius: 10px;
  border-bottom-left-radius: ${(props) => (props.sentByMe ? "10px" : 0)};
  border-bottom-right-radius: ${(props) => (props.sentByMe ? 0 : "10px")};
  transition: background-color;
  transition-duration: 0.2s;
`;

const Datestamp = styled.span<{ sentByMe: boolean }>`
  align-self: ${(props) => (props.sentByMe ? "flex-end" : "flex-start")};
  margin-left: ${(props) => (props.sentByMe ? 0 : "5px")};
  margin-right: ${(props) => (props.sentByMe ? "5px" : 0)};
  margin-bottom: 5px;
  font-size: 12px;
`;

interface MessageItemProps {
  message: Message;
  currentUserId: string | undefined;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
  return (
    <MessageWrapper sentByMe={currentUserId === message.sender.uid}>
      <MessageEl>
        <Datestamp sentByMe={currentUserId === message.sender.uid}>
          {dayjs(message.createdAt?.toDate()).format("HH:mm")}
        </Datestamp>
        <MessageText sentByMe={currentUserId === message.sender.uid}>
          {message.text}
        </MessageText>
      </MessageEl>
    </MessageWrapper>
  );
};

export default MessageItem;
