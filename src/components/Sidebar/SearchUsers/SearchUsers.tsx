import { User } from "firebase/auth";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoSearch } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import styled from "styled-components";
import {
  createConversation,
  searchUsers,
} from "../../../app/service/conversationsService";
import { auth } from "../../../firebase";
import { Conversation } from "../../../types";
import { formatAvatar } from "../../../utils";

const Form = styled.form`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 13px;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    margin-top: 18px;
    margin-right: 80px;
    margin-bottom: 0;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 25px;
  padding-left: 27px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.inputColorSecondary};
  border: 0.5px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  cursor: pointer;
  transition: color, background-color, border;
  transition-duration: 0.2s;
  :focus {
    outline: none;
    border-color: ${(props) => props.theme.inputBorderColor};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  color: ${(props) => props.theme.textColor};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color;
  transition-duration: 0.2s;
  @media (max-width: 768px) {
    top: 9px;
    right: 10px;
  }
`;

const UsersList = styled.ul`
  margin-top: 10px;
  padding: 0 10px;
  border-bottom: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  transition: border;
  transition-duration: 0.2s;
`;

const UserItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  padding: 10px;
  padding-left: 20px;
  border-radius: 10px;
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.p`
  margin-left: 5px;
  margin-bottom: 3px;
  font-weight: 500;
  font-size: 16px;
`;

const UserEmail = styled.p`
  margin-left: 5px;
  font-size: 12px;
  opacity: 0.8;
`;

const CreateButton = styled.button`
  color: ${(props) => props.theme.textColor};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color;
  transition-duration: 0.2s;
  :not(:disabled) {
    :hover {
      color: ${(props) => props.theme.textColorHover};
    }
  }
  :disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const NotFound = styled.p`
  margin-left: 5px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const SearchUsers: React.FC = () => {
  const [currentUser] = useAuthState(auth);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isConversationCreating, setIsConversationCreating] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<User[] | null>(null);

  const onSearchUsers = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!usernameRef.current?.value.trim()) {
      return;
    }
    setIsSearching(true);

    await searchUsers(
      usernameRef.current.value.trim(),
      currentUser?.displayName as string,
      setSearchedUsers
    );
    setIsSearching(false);
  };

  const onCreateConversation = async (user: User) => {
    setIsConversationCreating(true);
    const newConversation: Conversation = {
      creator: {
        uid: currentUser?.uid!,
        displayName: currentUser?.displayName!,
        photoURL: currentUser?.photoURL || null,
      },
      participant: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
      },
      latestMessage: "",
      hasCreatorSeenLatestMessage: true,
      hasParticipantSeenLatestMessage: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await createConversation(newConversation, onClearSearchedUsers);
    setIsConversationCreating(false);
  };

  const onClearSearchedUsers = () => {
    if (usernameRef.current) {
      usernameRef.current.value = "";
    }
    setSearchedUsers(null);
  };

  return (
    <>
      <Form onSubmit={onSearchUsers}>
        <SearchIcon>
          <GoSearch size={14} />
        </SearchIcon>
        <SearchInput
          placeholder="Search"
          maxLength={10}
          ref={usernameRef}
          disabled={isSearching}
        />
        {usernameRef.current?.value && (
          <CloseButton type="button" onClick={onClearSearchedUsers}>
            <IoClose size={15} />
          </CloseButton>
        )}
      </Form>
      {searchedUsers ? (
        <UsersList>
          {searchedUsers.length ? (
            searchedUsers.map((user) => (
              <UserItem key={user.uid}>
                <UserWrapper>
                  {formatAvatar(user)}
                  <div>
                    <Username>{user?.displayName}</Username>
                    <UserEmail>{user?.email}</UserEmail>
                  </div>
                </UserWrapper>
                <CreateButton
                  disabled={isConversationCreating}
                  onClick={() => onCreateConversation(user)}
                >
                  <MdAdd size={25} />
                </CreateButton>
              </UserItem>
            ))
          ) : (
            <NotFound>Users not found</NotFound>
          )}
        </UsersList>
      ) : null}
    </>
  );
};

export default SearchUsers;
