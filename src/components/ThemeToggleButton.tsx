import styled from "styled-components";
import { CgDarkMode } from "react-icons/cg";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  border-radius: 10px;
  transition: all 0.2s;
  cursor: pointer;
`;

const Button = styled.button`
  padding: 8px 13px;
  color: ${(props) => props.theme.textColor};
  background: transparent;
  border: none;
  cursor: pointer;
`;

interface ThemeToggleButtonProps {
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ toggleTheme }) => {
  return (
    <Wrapper>
      <Button onClick={toggleTheme}>
        <CgDarkMode size={25} />
      </Button>
    </Wrapper>
  );
};

export default ThemeToggleButton;
