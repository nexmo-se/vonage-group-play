import Content from "./components/Content";
import Dismiss from "./components/Dismiss";
import Footer from "./components/Footer";
import Header from "./components/Header";

interface ModalProps {
  id: string;
  children: any;
}

function Modal ({ id, children }: ModalProps) {
  return (
    <div id={id} className="Vlt-modal">
      <div className="Vlt-modal__panel">
        {children}
      </div>
    </div>
  )
}

Modal.Header = Header;
Modal.Dismiss = Dismiss;
Modal.Content = Content;
Modal.Footer = Footer;

export { useModal } from "./hooks/modal";
export default Modal;
