import styled from "styled-components";

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  margin-bottom: 15px;
  padding: 0 10px;
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
  border: none;
  background-color: ${(props) => props.theme.inputColorPrimary};
  border-radius: 12px;
  transition: color, background-color, box-shadow;
  transition-duration: 0.2s;
  :focus {
    outline: none;
    box-shadow: 0 0 0 0.5px ${(props) => props.theme.borderColorPrimary};
  }
  ::placeholder {
    color: #989a9c;
    opacity: 0.8;
  }
`;

export default Input;
