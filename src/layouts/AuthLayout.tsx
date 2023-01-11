import styled from "styled-components";
import poster from "../assets/poster.jpg";

const Container = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  @media (max-width: 768px) {
    height: calc(var(--vh, 1vh) * 100);
  }
`;

const Poster = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const PosterImg = styled.img`
  width: 100%;
`;

const AuthSection = styled.section`
  flex: 1;
  background-color: ${(props) => props.theme.bgColorPrimary};
  border-left: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  transition: all 0.2s;
`;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Container>
      <Poster>
        <PosterImg src={poster} />
      </Poster>
      <AuthSection>{children}</AuthSection>
    </Container>
  );
};

export default AuthLayout;
