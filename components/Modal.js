import { useEffect } from "react";
import style from "../styles/modal.module.css";

function Modal({
  open,
  modalLable,
  children,
  onClose,
  customContainer,
  customModal,
}) {
  useEffect(() => {
    document.body.classList.toggle("noscroll", open);
  }, [open]);

  const handleClose = (e) => {
    if (e.target.className === "modalContainer") {
      onClose();
    } else if (e.target.className?.split(" ")[0] === "modalContainer") {
      onClose();
    }
    return null;
  };

  if (open) {
    return (
      <div
        className={`${style.modalContainer} ${customContainer}`}
        onClick={handleClose}
      >
        <div className={`${style.modal} ${customModal}`}>
          <div className={style.modal__head}>
            <h2>{modalLable}</h2>
            <span className={style.modal__close} onClick={onClose}>
              x
            </span>
          </div>
          {children}
        </div>
      </div>
    );
  }
  return null;
}

export default Modal;
