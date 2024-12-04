import Modal from "./Modal";
import { AddAPhotoOutlined, CloseOutlined } from "@mui/icons-material";
import { TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useUpdateUserMutation } from "../redux/services/user";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase";
import style from "../styles/profileCard.module.css";
import { toast } from "react-toastify";

function EditProfile({
  setIsEditOpen,
  coverImage,
  profileImage,
  isEditOpen,
  name,
  bio,
  profileImageRef,
  coverImageRef,
  coverPic,
  profilePic,
  setProfilePic,
  setCoverPic,
  setEditIsLoading,
  editIsLoading,
}) {
  const [updateUser] = useUpdateUserMutation();

  const [inputs, setInputs] = useState({ username: "", bio: "" });

  useEffect(() => {
    if (name) {
      setInputs({ username: name, bio: bio });
    }
  }, [name, bio]);

  useEffect(() => {
    if (isEditOpen) {
      setCoverPic(coverImage);
      setProfilePic(profileImage);
    }
  }, [isEditOpen, coverImage, profileImage, setCoverPic, setProfilePic]);

  // function to remove image from state and input field
  const removeImage = () => {
    setCoverPic({ url: "", filename: "" });
    setProfilePic({ url: "", filename: "" });
  };

  // delete old image from firebase storage when user changes profile or cover image
  const deleteFromFirebase = async (filename) => {
    const desertRef = ref(storage, `weConect/${filename}`);
    await deleteObject(desertRef);
  };

  // upload cover image and profile image to firebase storage if they are set in the file input
  const uploadToFirebase = async (imageRef, picObject) => {
    setEditIsLoading(true);
    if (imageRef.current.files && imageRef.current.files[0]) {
      if (imageRef.current.files[0]["type"].split("/")[0] === "image") {
        const file = imageRef.current.files[0];
        const filename = file.name + Date.now();
        const storageRef = ref(storage, `weConect/${filename}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return {
          filename,
          url,
        };
      }
    }
    return {
      filename: picObject.filename,
      url: picObject.url,
    };
  };

  const editUser = async (e) => {
    e.stopPropagation();
    setIsEditOpen(false);
    let profileImgRes = { url: profilePic.url, filename: profilePic.filename };
    let coverImgRes = { url: coverPic.url, filename: coverPic.filename };

    let payload: UpdateUser = {};

    // upload to firebase storage only when the profile images has been modified
    if (profilePic.filename === "" && profilePic.url !== profileImage.url) {
      profileImgRes = await uploadToFirebase(profileImageRef, profilePic);
      payload.profilePicture = profileImgRes;
    }
    // upload to firebase storage only when the cover images has been modified
    if (coverPic.filename === "" && coverPic.url !== coverImage.url) {
      coverImgRes = await uploadToFirebase(coverImageRef, coverPic);
      payload.coverPicture = coverImgRes;
    }
    if (name !== inputs.username) {
      payload.username = inputs.username;
    }
    if (bio !== inputs.bio) {
      payload.bio = inputs.bio;
    }

    if (payload) {
      const res = await updateUser(payload);
      if (res.error) {
        let message = "Something went wrong";
        if ("status" in res.error && res.error.status === 403)
          message =
            "message" in (res.error.data as { message?: string })
              ? JSON.stringify((res.error.data as { message?: string }).message)
              : "";
        toast.error(message);
      }
    }

    setEditIsLoading(false);

    if (coverPic.filename === "" && !!coverImage.url) {
      await deleteFromFirebase(coverImage.filename);
    }
    if (profilePic.filename === "" && !!profileImage.url) {
      await deleteFromFirebase(profileImage.filename);
    }
    removeImage();
  };

  const closeModal = () => {
    setIsEditOpen(false);
    removeImage();
  };

  return (
    <Modal
      open={isEditOpen}
      onClose={closeModal}
      modalLable="Edit profile"
      customModal={style.profileCard__editModal}
    >
      <div className={style.profileCard__edit}>
        <div className={style.profileCard__edit__head}>
          <div>
            <CloseOutlined
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className={style.close}
            />
            <h3>Edit profile</h3>
          </div>
          <Button
            variant="contained"
            onClick={editUser}
            disabled={editIsLoading}
            style={{
              backgroundColor: `${editIsLoading ? "gray" : "var(--p-color1)"}`,
              color: `${editIsLoading && "white"}`,
            }}
          >
            {editIsLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className={style.profileCard__edit__coverImage}>
          <img
            src={coverPic?.url ? coverPic?.url : "/assets/noCover.avif"}
            alt="cover"
          />
          <div className={style.profileCard__edit__coverImage__icons}>
            <AddAPhotoOutlined
              onClick={(e) => {
                e.stopPropagation();
                coverImageRef.current.click();
              }}
            />
            {coverPic?.url && (
              <CloseOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setCoverPic({ url: "", filename: "" });
                  coverImageRef.current.value = "";
                }}
              />
            )}
          </div>
        </div>
        <div className={style.profileCard__profileImage}>
          <img
            src={profilePic?.url ? profilePic?.url : "/assets/noProfile.jpg"}
            alt="profile"
          />
          <div
            className={`${style.profileCard__edit__coverImage__icons} ${style.mod}`}
          >
            <AddAPhotoOutlined
              onClick={(e) => {
                e.stopPropagation();
                profileImageRef.current.click();
              }}
            />
            {profilePic?.url && (
              <CloseOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setProfilePic({ url: "", filename: "" });
                  profileImageRef.current.value = "";
                }}
              />
            )}
          </div>
        </div>
        <div className={style.profileCard__editInputs}>
          <TextField
            id="outlined-basic"
            label="username"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="bio"
            variant="outlined"
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            multiline
            rows={2}
          />
        </div>
      </div>
    </Modal>
  );
}

export default EditProfile;
