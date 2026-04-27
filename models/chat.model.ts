import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    senderId: string;
    receiverId: string;
    message: string;
    senderName: string;
}

const ChatSchema = new Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, default: "admin" }, // যেহেতু আপনি এডমিনকে পাঠাচ্ছেন
    senderName: { type: String },
    message: { type: String, required: true },
}, { timestamps: true });

export const ChatModel = mongoose.model<IMessage>("Chat", ChatSchema);