import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import styled from "styled-components";
import toast from "react-hot-toast";
import { BiShow, BiHide } from "react-icons/bi";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { auth } from "../firebase";
import { FIREBASE_REGISTER_ERROR } from "../firebase/errors";
import logo from "../assets/logo.png";

const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  border-radius: 10px;
  transition: border;
  transition-duration: 0.2s;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Title = styled.h1`
  position: absolute;
  top: 30px;
  left: 15px;
  font-size: 30px;
  color: ${(props) => props.theme.textColor};
  transition: color;
  transition-duration: 0.2s;
`;

const CustomLink = styled(Link)`
  position: absolute;
  top: 45px;
  right: 20px;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  transition: color;
  transition-duration: 0.2s;
  :hover {
    color: ${(props) => props.theme.textColorHover};
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Logo = styled.img`
  position: relative;
  bottom: 60px;
  width: 100px;
  height: 100px;
  object-fit: contain;
  @media (max-width: 768px) {
    bottom: 52px;
    width: 80px;
    height: 80px;
  }
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  margin-top: -20px;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const ShowPswd = styled.span`
  position: absolute;
  top: 20%;
  right: 3%;
  font-size: 30px;
  color: #989a9c;
  opacity: 0.7;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const ErrorMsg = styled.div`
  position: absolute;
  bottom: 80px;
  margin-left: 5px;
  font-size: 12px;
  color: red;
`;

const SubmitButton = styled(Button)`
  height: 60px;
  margin-top: 20px;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const ThemeButtonWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;

interface SignupProps {
  toggleTheme: () => void;
}

const Signup: React.FC<SignupProps> = ({ toggleTheme }) => {
  const [, isUserLoading] = useAuthState(auth);

  const [createUserWithEmailAndPassword, , isLoading, credentialsError] =
    useCreateUserWithEmailAndPassword(auth);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  const [isPasswordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const [error, setError] = useState("");

  const handleSetPasswordVisible = () => {
    setPasswordVisible((prev) => ({
      ...prev,
      password: !isPasswordVisible.password,
    }));
  };

  const handleSetConfirmPasswordVisible = () => {
    setPasswordVisible((prev) => ({
      ...prev,
      confirmPassword: !isPasswordVisible.confirmPassword,
    }));
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (error) setError("");

    if (!emailRef.current || !passwordRef.current) {
      return;
    }

    const formattedEmail = emailRef.current?.value.replaceAll(" ", "");
    const formattedPassword = passwordRef.current?.value.replaceAll(" ", "");
    const formattedConfirmPassword = passwordRef.current?.value.replaceAll(" ", "");

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formattedEmail)) {
      setError("Invalid email");
      return;
    }

    if (formattedPassword.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    if (formattedPassword !== formattedConfirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const toastId = toast.loading("Loading...");

    try {
      await createUserWithEmailAndPassword(formattedEmail, formattedPassword);
    } catch (error: any) {
      setError(error.message);
    }
    toast.dismiss(toastId);
  };

  if (isUserLoading) {
    return <></>;
  }

  return (
    <AuthLayout>
      <Container>
        <ThemeButtonWrapper>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </ThemeButtonWrapper>
        <Wrapper>
          <Title>Sign Up</Title>
          <CustomLink to="/login">Have an account? Log in</CustomLink>
          <Logo src={logo} />
          <Form onSubmit={handleSubmit}>
            <Input type="email" placeholder="Your email" maxLength={30} ref={emailRef} />
            <InputWrapper>
              <Input
                placeholder="Create password"
                maxLength={30}
                type={isPasswordVisible.password ? "text" : "password"}
                ref={passwordRef}
              />
              <ShowPswd onClick={handleSetPasswordVisible}>
                {isPasswordVisible.password ? <BiHide /> : <BiShow />}
              </ShowPswd>
            </InputWrapper>
            <InputWrapper>
              <Input
                placeholder="Confirm password"
                maxLength={30}
                type={isPasswordVisible.confirmPassword ? "text" : "password"}
                ref={confirmPasswordRef}
              />
              <ShowPswd onClick={handleSetConfirmPasswordVisible}>
                {isPasswordVisible.confirmPassword ? <BiHide /> : <BiShow />}
              </ShowPswd>
            </InputWrapper>
            <ErrorMsg>
              {error ||
                FIREBASE_REGISTER_ERROR[
                  credentialsError?.message as keyof typeof FIREBASE_REGISTER_ERROR
                ]}
            </ErrorMsg>
            <SubmitButton type="submit" disabled={isLoading}>
              Sign up
            </SubmitButton>
          </Form>
        </Wrapper>
      </Container>
    </AuthLayout>
  );
};

export default Signup;
