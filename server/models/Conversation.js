import { model, Schema, models } from "mongoose";

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation =
  models.Conversation || model("Conversation", ConversationSchema);
export default Conversation;
