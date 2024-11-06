import { Modal } from "@mantine/core";
import Share from "./Share";
import { useDispatch, useSelector } from "react-redux";
import { selectModalIsOpen, setModalIsOpen } from "@/redux/modalSlice";

function ShareModal({ setNewPosts }: Omit<Share, "closeModal">) {
  const dispatch = useDispatch();
  const modalIsOpen = useSelector(selectModalIsOpen);

  return (
    <Modal
      size="55%"
      opened={modalIsOpen}
      onClose={() => dispatch(setModalIsOpen(false))}
    >
      <Share
        closeModal={() => dispatch(setModalIsOpen(false))}
        setNewPosts={setNewPosts}
      />
    </Modal>
  );
}

export default ShareModal;
