import { model, Schema, models, Model } from "mongoose";

const MessageSchema = new Schema<MessageSchema>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message: Model<MessageSchema> =
  models.Message || model<MessageSchema>("Message", MessageSchema);
export default Message;
