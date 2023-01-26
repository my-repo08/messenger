import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { SetterOrUpdater } from "recoil";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { ConversationsState } from "../atoms/conversationsState";
import { CurrentConversationState } from "../atoms/currentConversation";
import { Conversation } from "../../types";

export const getConversations = (
  currentUserId: string | undefined,
  setConversationsStateValue: SetterOrUpdater<ConversationsState>
) => {
  try {
    const q = query(
      collection(db, "conversations"),
      where("participantIds", "array-contains", currentUserId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversations = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Conversation[];

      setConversationsStateValue((prev) => ({
        ...prev,
        conversations,
      }));
    });

    return () => unsubscribe();
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while receiving conversations");
  }
};

export const searchUsers = async (
  username: string,
  currentUserDisplayName: string,
  setSearchedUsers: (users: User[]) => void
) => {
  try {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username),
      where("displayName", "!=", currentUserDisplayName)
    );

    const userDocs = await getDocs(q);
    const users = userDocs.docs.map((doc) => doc.data());
    setSearchedUsers(users as User[]);
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while searching user");
  }
};

export const createConversation = async (
  newConversation: Conversation,
  onClearSearchedUsers: () => void
) => {
  try {
    await setDoc(doc(db, "conversations", nanoid()), newConversation);
    onClearSearchedUsers();
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while creating conversation");
  }
};

export const deleteConversation = async (
  conversationId: string,
  setCurrentConversationStateValue: SetterOrUpdater<CurrentConversationState>
) => {
  const batch = writeBatch(db);
  try {
    batch.delete(doc(db, "conversations", conversationId));
    await batch.commit();
    setCurrentConversationStateValue(() => ({ conversation: null }));
  } catch (error) {
    console.log(error as Error);
    toast.error("Error while deleting conversation");
  }
};
