import { useEffect, useRef } from "react";
import style from "../styles/modal.module.css";
import { X } from "@phosphor-icons/react";

function Modal({
  open,
  modalLable,
  children,
  onClose,
  customContainer,
  customModal,
  removeCloseIcon,
}: Modal) {
  const modalContainerRef = useRef();

  useEffect(() => {
    document.body.classList.toggle("noscroll", open);
  }, [open]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalContainerRef.current === e.target) {
      onClose();
    }
    return null;
  };

  if (open) {
    return (
      <div
        className={`${style.modalContainer} ${customContainer}`}
        onClick={handleClose}
        ref={modalContainerRef}
      >
        <div className={`${style.modal} ${customModal}`}>
          <div className={style.modal__head}>
            {removeCloseIcon && (
              <>
                <h2>{modalLable}</h2>
                <span className={style.modal__close} onClick={onClose}>
                  <X size={20} />
                </span>
              </>
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }
  return null;
}

export default Modal;
