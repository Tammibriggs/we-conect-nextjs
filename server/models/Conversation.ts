import { model, Schema, models, Model } from "mongoose";

const ConversationSchema = new Schema<ConversationSchema>(
  {
    members: {
      type: [{ type: String }],
    },
    unReadMessagesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Conversation: Model<ConversationSchema> =
  models.Conversation ||
  model<ConversationSchema>("Conversation", ConversationSchema);

export default Conversation;
