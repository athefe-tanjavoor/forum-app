import { type Types } from "mongoose";
import mongoose, { model, Schema } from "mongoose";

export interface IPost extends mongoose.Document {
  admin: Types.ObjectId;
  ForumName: string;
  content: string;
  category:
    | "EDUCATION"
    | "TECHNOLOGY"
    | "TRAVELS"
    | "FOOD"
    | "FASHION"
    | "POLITICS";
  image: Types.ObjectId;
  video: Types.ObjectId;
  Gif: Types.ObjectId;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  forumMembers: Types.ObjectId[];
  retweets: Types.ObjectId[];
  views: Types.ObjectId[];
  saveForum: Types.ObjectId[];
  location: string;
  ForumRules: string;
  created_at: Date;
  updated_at: Date;
}

const postSchema = new Schema<IPost>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "General Discussion",
        "CryptoCurrency",
        "Education",
        "Technology",
        "Travels",
        "Food",
        "Fashion",
        "Politics",
        "Movies",
        "Finance",
        "Sports",
        "Tinder",
        "Arts and Entertainment",
        "Crypto",
        "Music",
        "Games",
        "Tech",
        "News",
        "Health",
        "Science",
        "Jobs",
        "Finance",
        "Painting",
        "Announcements",
        "News",
        "Relationship",
        "Dating",
        "Programming and Coding",
        "Design and Graphics",
        "Fitness and Workout Tips",
        "Adventure Travel and Backpacking",
        "Recipe Exchange and Cooking Tips",
        "Makeup and Skincare",
        "Movie Reviews and Recommendations",
        "DIY and Crafts",
        "Academic Subjects",
        "Job Openings",
        "Freelance Opportunities",
        "Environmental Issues",
        "Mental Health and Well-being",
        "Pet Care and Animal Welfare",
        "Automotive and Car Enthusiasts",
        "Financial Planning and Investment",
        "Home and Garden",
        "Photography and Videography",
        "Music Instruments and Techniques",
        "Parenting Tips and Advice",
        "Community Events and Gatherings",
        "Yoga and Meditation",
        "Graphic Design",
        "Relationship Advice and Support",
      ],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    video: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    Gif: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saveForum: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IPost>("Post", postSchema);
