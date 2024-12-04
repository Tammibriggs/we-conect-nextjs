import User from "../models/User";
import { connectDbWithoutHanlder } from "./mongodb";

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const hasDisallowedFields = (requestBody, disallowedFields) => {
  const fieldChecks = [];
  for (const field of disallowedFields) {
    if (field in requestBody) {
      fieldChecks.push(field);
    }
  }
  return !!fieldChecks.length;
};

const generateUsername = (username) => {
  // Generate a random string to append to the username
  return `${username}${Math.floor(Math.random() * 10000)}`;
};

const checkUsername = async (username: string) => {
  await connectDbWithoutHanlder()
  // Check if the username exists
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    // If username exists, generate and check new usernames
    let newUsername = generateUsername(username);

    // Keep generating new usernames until an available one is found
    while (await User.findOne({ username: newUsername })) {
      newUsername = generateUsername(username);
    }

    return { exists: true, suggestedUsername: newUsername };
  }
  return { exists: false, suggestedUsername: null };
};

export { escapeRegex, hasDisallowedFields, checkUsername };
