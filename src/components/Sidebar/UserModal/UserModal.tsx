import { useRef, useState } from "react";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { updateUserProfile } from "../../../app/service/userService";
import userIcon from "../../../assets/add-user.png";
import { auth } from "../../../firebase";
import useSelectImage from "../../../hooks/useSelectImage";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import Modal from "../../UI/Modal";

const Title = styled.h4`
  margin-bottom: 20px;
  color: ${(props) => props.theme.textColor};
  transition: color;
  transition-duration: 0.2s;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const UsernameInput = styled(Input)`
  height: 50px;
  margin-bottom: 0;
  font-size: 14px;
`;

const Avatar = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: white;
  object-fit: cover;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  height: 50px;
  font-size: 14px;
`;

interface UserModalProps {
  setOpen: (open: boolean) => void;
}

const UserModal: React.FC<UserModalProps> = ({ setOpen }) => {
  const [currentUser] = useAuthState(auth);

  const [updateProfile] = useUpdateProfile(auth);

  const { selectedImage, onSelectImage } = useSelectImage();
  const selectedImageRef = useRef<HTMLInputElement>(null);

  const displayNameRef = useRef<HTMLInputElement | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectImage = () => {
    selectedImageRef.current?.click();
  };

  const onUpdateUserProfile = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!displayNameRef.current?.value.trim()) {
      if (displayNameRef.current?.value) {
        displayNameRef.current.value = "";
        displayNameRef.current?.focus();
      }
      return;
    }
    setIsUpdating(true);
    await updateUserProfile(
      selectedImage,
      currentUser?.uid,
      displayNameRef.current.value,
      updateProfile,
      setOpen
    );
    setIsUpdating(false);
  };

  return (
    <Modal onClick={() => {}}>
      <Title>Set up your profile</Title>
      <form onSubmit={onUpdateUserProfile}>
        <InputWrapper>
          <Avatar src={selectedImage || userIcon} onClick={handleSelectImage} />
          <input
            id="file-upload"
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            hidden
            ref={selectedImageRef}
            onChange={onSelectImage}
          />
          <UsernameInput
            placeholder="Create username"
            maxLength={10}
            ref={displayNameRef}
          />
        </InputWrapper>
        <SubmitButton type="submit" disabled={isUpdating}>
          Save changes
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default UserModal;
