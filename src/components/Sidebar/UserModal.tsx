import { useRef, useState } from "react";
import { getDownloadURL, uploadString, ref } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import Input from "../UI/Input";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import useSelectImage from "../../hooks/useSelectImage";
import { auth, db, storage } from "../../firebase/firebase";
import userIcon from "../../assets/add-user.png";

const Title = styled.h4`
  margin-bottom: 20px;
  color: ${(props) => props.theme.textColor};
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
  setOpen: (arg: boolean) => void;
}

const UserModal: React.FC<UserModalProps> = ({ setOpen }) => {
  const [currentUser] = useAuthState(auth);

  const { selectedImage, onSelectImage } = useSelectImage();
  const selectedImageRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const onSetUsername = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value);
  };

  const handleSelectImage = () => {
    selectedImageRef.current?.click();
  };

  const [updateProfile] = useUpdateProfile(auth);

  const onUpdateProfile = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsUpdating(true);
    let downloadURL = null;
    try {
      if (selectedImage) {
        const imageRef = ref(storage, `users/${currentUser?.uid}/image`);
        await uploadString(imageRef, selectedImage, "data_url");
        downloadURL = await getDownloadURL(imageRef);
      }
      await updateProfile({ displayName: username, photoURL: downloadURL });
      await updateDoc(doc(db, "users", currentUser?.uid as string), {
        displayName: username,
        photoURL: downloadURL,
      });
      setOpen(false);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
    setIsUpdating(false);
  };

  const isDisabled = !username.trim() || isUpdating;

  return (
    <Modal onClick={() => {}}>
      <Title>Set up your profile</Title>
      <form onSubmit={onUpdateProfile}>
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
            value={username}
            onChange={onSetUsername}
          />
        </InputWrapper>
        <SubmitButton type="submit" disabled={isDisabled}>
          Save changes
        </SubmitButton>
      </form>
    </Modal>
  );
};

export default UserModal;
