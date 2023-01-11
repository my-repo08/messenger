import styled from "styled-components";
import { motion } from "framer-motion";

const ModalBackdrop = styled(motion.div)`
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
`;

const ModalContent = styled(motion.div)`
  width: 430px;
  font-size: 20px;
  padding: 30px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.bgColorPrimary};
  border: 0.5px solid ${(props) => props.theme.borderColorPrimary};
  border-radius: 14px;
  @media (max-width: 768px) {
    width: 300px;
    margin-bottom: 80px;
    padding: 25px;
  }
`;

const VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
};

type ModalProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClick }) => {
  return (
    <ModalBackdrop
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ModalContent
        onClick={(evt) => evt.stopPropagation()}
        variants={VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </ModalContent>
    </ModalBackdrop>
  );
};

export default Modal;
