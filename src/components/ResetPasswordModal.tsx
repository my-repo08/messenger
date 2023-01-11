import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { AiOutlineMail } from "react-icons/ai";
import { auth } from "../firebase/firebase";
import { Button, Input, Modal } from "../components/UI";

const Title = styled.h3`
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
`;

const Text = styled.p`
  margin-bottom: 30px;
  font-size: 16px;
  text-align: center;
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  position: relative;
`;

const AuthInput = styled(Input)`
  height: 50px;
  margin-bottom: 20px;
  font-size: 16px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const SubmitButton = styled(Button)`
  height: 50px;
`;

const ErrorMsg = styled.div`
  position: absolute;
  left: 5px;
  bottom: 60px;
  font-size: 12px;
  color: red;
`;

const SuccessMsg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 22px 0;
  font-size: 16px;
  text-align: center;
`;

interface ResetPasswordModalProps {
  setOpen: (arg: boolean) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ setOpen }) => {
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };

  const isDisabled =
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || sending;

  return (
    <Modal onClick={() => setOpen(false)}>
      <Title>Recover password</Title>
      <Text>
        Enter the email associated with your account to receive a link for password
        recovery
      </Text>
      <Form onSubmit={onSubmit}>
        <AuthInput
          type="email"
          placeholder="Your email"
          maxLength={30}
          onChange={handleEmailChange}
        />
        {error && <ErrorMsg>{error.message}</ErrorMsg>}
        {success ? (
          <SuccessMsg>
            Check your email
            <AiOutlineMail size={18} />
          </SuccessMsg>
        ) : (
          <SubmitButton type="submit" disabled={isDisabled}>
            Recover
          </SubmitButton>
        )}
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
