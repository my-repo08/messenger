import { signOut, User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../../firebase";
import { formatAvatar } from "../../../utils";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: border;
  transition-duration: 0.2s;
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const UserEmail = styled.p`
  font-size: 12px;
  opacity: 0.5;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  transition: color;
  transition-duration: 0.2s;
  :hover {
    color: ${(props) => props.theme.textColorHover};
  }
`;

const UserInfo: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser] = useAuthState(auth);

  const onSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error as Error);
      toast.error("Unable to log out");
    }
  };

  return (
    <Wrapper>
      <UserWrapper>
        {formatAvatar(currentUser as User)}
        <div>
          <Username>{currentUser?.displayName}</Username>
          <UserEmail>{currentUser?.email}</UserEmail>
        </div>
      </UserWrapper>
      <LogoutButton onClick={onSignOut}>
        <IoLogOutOutline size={26} />
      </LogoutButton>
    </Wrapper>
  );
};

export default UserInfo;
