import * as yup from "yup";

const authShema = yup.object().shape({
  username: yup.string().required('"username" is required'),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters long")
    .required('"password" is required'),
});

const createPostSchema = yup.object().shape({
  desc: yup.string().required('"desc" is required '),
  img: yup.object().shape({
    url: yup.string(),
    filename: yup.string(),
  }),
});

const updateUserSchema = yup.object().shape({
  username: yup.string(),
  bio: yup.string(),
  profilePicture: yup.object().shape({
    url: yup.string(),
    filename: yup.string(),
  }),
  coverPicture: yup.object().shape({
    url: yup.string(),
    filename: yup.string(),
  }),
});

export { authShema, createPostSchema, updateUserSchema };
