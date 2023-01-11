import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { auth, db } from "../../firebase/firebase";
import { ConversationInfo, Message } from "../../types";

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

const MessageItem = styled.li<{ sentByMe: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.sentByMe ? "flex-end" : "flex-start")};
  padding: 10px;
  color: ${(props) => props.theme.textColor};
  transition: color;
  transition-duration: 0.2s;
`;

const MessageWrapper = styled.div`
  max-width: 65%;
  display: flex;
  flex-direction: column;
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
  transition: color;
  transition-duration: 0.2s;
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  display: flex;
  padding: 10px;
  padding-bottom: 15px;
`;

const MessageInput = styled.input`
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
`;

interface MessagesProps {
  conversationInfo: ConversationInfo;
}

const Messages: React.FC<MessagesProps> = ({ conversationInfo }) => {
  const [currentUser] = useAuthState(auth);

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>();

  const getMessages = async () => {
    try {
      const q = query(
        collection(
          db,
          `messages/${conversationInfo.conversationId}/conversationMessages`
        ),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const myMessages = querySnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setMessages(myMessages as Message[]);
        //@ts-ignore
        if (myMessages[0]?.sender?.uid !== currentUser?.uid) {
          onViewLatestMessage(currentUser?.uid as string, conversationInfo);
        }
      });
      return () => unsubscribe();
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!conversationInfo.conversationId) return;
    getMessages();
  }, [conversationInfo.conversationId]);

  const onSendMessage = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const text = messageText;
    setMessageText("");
    const batch = writeBatch(db);
    try {
      batch.set(
        doc(
          db,
          `messages/${conversationInfo.conversationId}/conversationMessages/${nanoid()}`
        ),
        {
          sender: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoURL: currentUser?.photoURL,
          },
          text,
          createdAt: serverTimestamp(),
        }
      );

      let updatedConversation;

      if (currentUser?.uid === conversationInfo.creatorId) {
        updatedConversation = {
          latestMessage: text,
          updatedAt: serverTimestamp(),
          hasCreatorSeenLatestMessage: true,
          hasParticipantSeenLatestMessage: false,
        };
      } else if (currentUser?.uid === conversationInfo.participantId) {
        updatedConversation = {
          latestMessage: text,
          updatedAt: serverTimestamp(),
          hasCreatorSeenLatestMessage: false,
          hasParticipantSeenLatestMessage: true,
        };
      }

      batch.update(
        doc(db, `conversations/${conversationInfo.conversationId}`),
        updatedConversation
      );
      await batch.commit();
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const onViewLatestMessage = async (
    currentUserId: string,
    conversationInfo: ConversationInfo
  ) => {
    if (!conversationInfo.conversationId) {
      return;
    }

    let lastMessageSeen;
    if (currentUserId === conversationInfo.creatorId) {
      lastMessageSeen = {
        hasCreatorSeenLatestMessage: true,
      };
    } else if (currentUserId === conversationInfo.participantId) {
      lastMessageSeen = {
        hasParticipantSeenLatestMessage: true,
      };
    }

    try {
      await updateDoc(
        doc(db, `conversations/${conversationInfo.conversationId}`),
        lastMessageSeen
      );
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <MessagesWrapper>
      <MessagesList>
        {messages?.map((message) => (
          <MessageItem
            sentByMe={currentUser?.uid === message.sender.uid}
            key={message.id}
          >
            <MessageWrapper>
              <Datestamp sentByMe={currentUser?.uid === message.sender.uid}>
                {dayjs(message.createdAt?.toDate()).format("HH:mm")}
              </Datestamp>
              <MessageText sentByMe={currentUser?.uid === message.sender.uid}>
                {message.text}
              </MessageText>
            </MessageWrapper>
          </MessageItem>
        ))}
      </MessagesList>
      <Form onSubmit={onSendMessage}>
        <MessageInput
          type="text"
          maxLength={3000}
          value={messageText}
          onChange={(evt) => setMessageText(evt.target.value)}
        />
        <SendButton type="submit">
          <BsFillArrowUpCircleFill size={24} />
        </SendButton>
      </Form>
    </MessagesWrapper>
  );
};

export default Messages;
