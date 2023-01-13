import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentConversationState } from "../../../app/atoms/currentConversation";
import { messagesState } from "../../../app/atoms/messagesState";
import { getMessages, viewLatestMessage } from "../../../app/service/messagesService";
import { auth } from "../../../firebase";
import MessageInput from "./MessageInput/MessageInput";
import MessageItem from "./MessageItem/MessageItem";

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
`;

const MessagesList = styled.ul`
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-self: normal;
  margin: 0;
  padding: 0 5px;
  overflow-y: auto;
  list-style-type: none;
`;

const Messages: React.FC = () => {
  const [currentUser] = useAuthState(auth);

  const [messagesStateValue, setMessagesStateValue] = useRecoilState(messagesState);

  const currentConversationStateValue = useRecoilValue(currentConversationState);

  const messagesEndRef = useRef<null | HTMLElement>(null);

  useEffect(() => {
    if (!currentConversationStateValue.conversation?.id) {
      return;
    }
    getMessages(currentConversationStateValue.conversation?.id, setMessagesStateValue);
  }, [currentConversationStateValue.conversation?.id]);

  useEffect(() => {
    if (
      messagesStateValue.messages[
        currentConversationStateValue.conversation?.id as string
      ]?.[0]?.sender.uid !== currentUser?.uid &&
      currentConversationStateValue.conversation?.id
    ) {
      viewLatestMessage(currentUser?.uid, currentConversationStateValue.conversation);
    }
  }, [messagesStateValue.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesStateValue.messages]);

  return (
    <MessagesWrapper>
      <MessagesList>
        <span ref={messagesEndRef} />
        {messagesStateValue.messages[
          currentConversationStateValue.conversation?.id as string
        ]?.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            currentUserId={currentUser?.uid}
          />
        ))}
      </MessagesList>
      <MessageInput />
    </MessagesWrapper>
  );
};

export default Messages;
