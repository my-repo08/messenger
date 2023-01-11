import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { BiShow, BiHide } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import ThemeToggleButton from "../components/ThemeToggleButton";
import ResetPasswordModal from "../components/ResetPasswordModal";
import { auth } from "../firebase/firebase";
import { FIREBASE_LOGIN_ERRORS } from "../firebase/errors";
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
  transition: all 0.2s;
`;

const Title = styled.h1`
  position: absolute;
  top: 30px;
  left: 15px;
  font-size: 30px;
  color: ${(props) => props.theme.textColor};
  transition: all 0.2s;
`;

const CustomLink = styled(Link)`
  position: absolute;
  top: 45px;
  right: 20px;
  font-size: 13px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  transition: all 0.2s;
  :hover {
    color: ${(props) => props.theme.textColorHover};
    text-decoration: underline;
  }
`;

const Logo = styled.img`
  position: relative;
  bottom: 60px;
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  margin-top: -20px;
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

const ResetButton = styled.button`
  margin-bottom: 15px;
  margin-left: 5px;
  font-family: inherit;
  font-size: 13px;
  color: ${(props) => props.theme.textColor};
  border: none;
  background: transparent;
  transition: all 0.2s;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.div`
  position: absolute;
  bottom: 140px;
  margin-left: 5px;
  font-size: 12px;
  color: red;
`;

const SubmitButton = styled(Button)`
  height: 60px;
  margin-top: 15px;
  margin-bottom: 15px;
  transition: all 0.2s;
`;

const ThemeButtonWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;

const GoogleButton = styled(Button)`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
`;

interface LoginProps {
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ toggleTheme }) => {
  const [, userLoading] = useAuthState(auth);

  const [signInWithEmailAndPassword, , loading, credentialsError] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [error, setError] = useState("");

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [evt.target.name]: evt.target.value,
    }));
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    if (error) setError("");

    const toastId = toast.loading("Loading...");

    try {
      await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    } catch (error: any) {
      setError(error.message);
    }
    toast.dismiss(toastId);
  };

  const isDisabled =
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(loginForm.email) ||
    !loginForm.password ||
    loading;

  if (userLoading) {
    return <></>;
  }

  return (
    <AuthLayout>
      <Container>
        <ThemeButtonWrapper>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </ThemeButtonWrapper>
        <Wrapper>
          <Title>Log In</Title>
          <CustomLink to="/signup">No account yet? Register</CustomLink>
          <Logo src={logo} />
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Your email"
              maxLength={30}
              onChange={onInputChange}
            />
            <InputWrapper>
              <Input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                maxLength={30}
                onChange={onInputChange}
              />
              <ShowPswd onClick={() => setPasswordVisible((prev) => !prev)}>
                {isPasswordVisible ? <BiHide /> : <BiShow />}
              </ShowPswd>
            </InputWrapper>
            <ResetButton type="button" onClick={() => setIsModalOpen(true)}>
              Forgot your password?
            </ResetButton>
            <ErrorMsg>
              {error ||
                FIREBASE_LOGIN_ERRORS[
                  credentialsError?.message as keyof typeof FIREBASE_LOGIN_ERRORS
                ]}
            </ErrorMsg>
            <SubmitButton type="submit" disabled={isDisabled}>
              Log in
            </SubmitButton>
            <GoogleButton type="button" onClick={() => signInWithGoogle()}>
              <FcGoogle size={20} />
              Continue with Google
            </GoogleButton>
          </Form>
          <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
            {isModalOpen && <ResetPasswordModal setOpen={setIsModalOpen} />}
          </AnimatePresence>
        </Wrapper>
      </Container>
    </AuthLayout>
  );
};

export default Login;
