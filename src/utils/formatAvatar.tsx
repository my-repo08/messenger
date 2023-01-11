import styled from "styled-components";
import { ChatUser } from "../types";

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 10px;
  border-radius: 50%;
  object-fit: cover;
`;

const NoAvatar = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  color: white;
  background-color: #989ca6;
  border-radius: 50%;
  font-size: 20px;
`;

const formatAvatar = (user: ChatUser) => {
  if (user.photoURL) {
    return <Avatar src={user?.photoURL} />;
  } else {
    return <NoAvatar>{user.displayName?.[0]}</NoAvatar>;
  }
};

export default formatAvatar;
