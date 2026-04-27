import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: {
    score: number;
    totalReviews: number;
  };
  details: {
    totalLessons: number;
    duration: string;
    level: string;
  };
  pricing: {
    amount: number;
    currency: string;
    discountPrice: number;
  };
  isBestseller: boolean;
}

const CourseSchema = new Schema<ICourse>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    category: { type: String },
    instructor: {
      name: { type: String },
      role: { type: String },
      avatar: { type: String },
    },
    rating: {
      score: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },
    details: {
      totalLessons: { type: Number, default: 0 },
      duration: { type: String },
      level: { type: String },
    },
    pricing: {
      amount: { type: Number },
      currency: { type: String, default: "USD" },
      discountPrice: { type: Number },
    },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourseModel: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default CourseModel;