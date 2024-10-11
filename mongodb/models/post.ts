import { Icomment, IcommentBase, Comment } from '@/types/comments';
import { IUser } from '@/types/user';
import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

// Define IMessageBase interface for the base structure of a message
export interface IMessageBase {
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
}

// Extend IMessageBase to add Mongoose-specific fields like createdAt and updatedAt
export interface IMessage extends IMessageBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Custom methods for the Message model
interface IMessageMethods {
  sendMessage(): Promise<void>;
}

// Static methods for the Message model
interface IMessageStatics {
  getMessages(senderId: string, receiverId: string): Promise<IMessageDocument[]>;
}

// Export singular instance of a message
export interface IMessageDocument extends IMessage, IMessageMethods {}

// Model interface
interface IMessageModel extends IMessageStatics, Model<IMessageDocument> {}

// Mongoose Schema for Message
const MessageSchema = new Schema<IMessageDocument>(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    }, // Message text
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Instance Methods
MessageSchema.methods.sendMessage = async function () {
  try {
    await this.save();
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

// Static Methods
MessageSchema.statics.getMessages = async function (
  senderId: string,
  receiverId: string
): Promise<IMessageDocument[]> {
  try {
    return await this.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // Sort by createdAt to keep conversation in order
  } catch (error) {
    throw new Error("Failed to fetch messages");
  }
};

// Index on createdAt for better performance
MessageSchema.index({ createdAt: -1 });

// Check if the model already exists, otherwise define it
export const Message =
  (models.Message as IMessageModel) ||
  mongoose.model<IMessageDocument, IMessageModel>("Message", MessageSchema);

  // Define IContactBase interface for the base structure of a contact
  export interface IContactBase {
    userId: string; // ID of the user who has this contact
    contactId: string; // ID of the contact
    firstName: string; // First name of the contact
    lastName: string; // Last name of the contact
    imageUrl: string; // Image URL of the contact
  }
  
  // Extend IContactBase to add Mongoose-specific fields
  export interface IContact extends IContactBase, Document {
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Model interface
  interface IContactModel extends Model<IContact> {}
  
  // Mongoose Schema for Contact
  const ContactSchema = new Schema<IContact>(
    {
      userId: {
        type: String,
        required: true,
      },
      contactId: {
        type: String,
        required: true,
      },
      firstName: { // Store contact's first name
        type: String,
        required: true,
      },
      lastName: { // Store contact's last name
        type: String,
        required: true,
      },
      imageUrl: { // Store contact's image URL
        type: String,
        required: true,
      },
    },
    {
      timestamps: true, // Automatically add createdAt and updatedAt
    }
  );
  
  // Check if the model already exists, otherwise define it
  export const Contact = (models.Contact as IContactModel) || mongoose.model<IContact>("Contact", ContactSchema);
  

// Define IJobBase interface for the base structure of a job posting
export interface IJobBase {
  title: string; // Job title
  description: string; // Job description
  companyName: string; // Company name
  companyImageUrl: string; // URL to the company image/logo
  location: string; // Job location
  salaryRange: string; // Salary range
  employmentType: string; // Full-time, Part-time, Contract, etc.
  postedBy: string; // ID of the user who posted the job
  requirements: string[]; // Array of requirements for the job
}

// Extend IJobBase to add Mongoose-specific fields
export interface IJob extends IJobBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Custom methods for the Job model
interface IJobMethods {
  updateJob(data: Partial<IJobBase>): Promise<void>;
  removeJob(): Promise<void>;
}

// Static methods for the Job model
interface IJobStatics {
  getAllJobs(): Promise<IJobDocument[]>;
}

// Export singular instance of a job
export interface IJobDocument extends IJob, IJobMethods {}

// Model interface
interface IJobModel extends IJobStatics, Model<IJobDocument> {}

// Mongoose Schema for Job
const JobSchema = new Schema<IJobDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyImageUrl: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    salaryRange: {
      type: String,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Instance Methods
JobSchema.methods.updateJob = async function (data: Partial<IJobBase>) {
  try {
    Object.assign(this, data);
    await this.save();
  } catch (error) {
    throw new Error('Failed to update job');
  }
};

JobSchema.methods.removeJob = async function () {
  try {
    await this.deleteOne();
  } catch (error) {
    throw new Error('Failed to remove job');
  }
};

// Static Methods
JobSchema.statics.getAllJobs = async function (): Promise<IJobDocument[]> {
  try {
    return await this.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Failed to fetch jobs');
  }
};

// Index on createdAt for better performance
JobSchema.index({ createdAt: -1 });

// Check if the model already exists, otherwise define it
export const Job = (models.Job as IJobModel) || mongoose.model<IJobDocument, IJobModel>('Job', JobSchema);


// Define IpostBase interface for the base structure of a post
export interface IpostBase {
  user: IUser;
  text: string;
  imageUrl?: string;
  comments?: Icomment[];
  likes?: string[];
}

// Extend IpostBase to add Mongoose-specific fields like createdAt and updatedAt
export interface Ipost extends IpostBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Custom methods for the Post model
interface IpostMethods {
  likePost(userId: string): Promise<void>;
  unlikePost(userId: string): Promise<void>;
  commentOnPost(comment: IcommentBase): Promise<void>;
  getAllComments(): Promise<Icomment[]>;
  removeComment(commentId: string): Promise<void>;
}

// Static methods for the Post model
interface IPostStatics {
  getAllPosts(): Promise<IpostDocument[]>;
}

// Export singular instance of a post
export interface IpostDocument extends Ipost, IpostMethods {
  removePost(): unknown;
}

// Model interface
interface IPostModel extends IPostStatics, Model<IpostDocument> {
  removePost(): unknown;
  likes: any;
  likePost(id: string): unknown;
}

// Mongoose Schema for Post
const PostSchema = new Schema<IpostDocument>(
  {
    user: {
      userId: {
        type: String,
        required: true,
      },
      userImage: {
        type: String,
        required: true,
      },
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
      },
    },
    text: {
      type: String,
      required: true,
    }, // Post text
    imageUrl: {
      type: String,
    }, // Optional image URL
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }], // Reference to the Comment model
    likes: [{ type: String }], // Array of user IDs who liked the post
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Instance Methods
PostSchema.methods.likePost = async function (userId: string) {
  if (this.likes.includes(userId)) {
    throw new Error('User has already liked this post');
  }
  try {
    await this.updateOne({ $addToSet: { likes: userId } });
  } catch (error) {
    throw new Error('Failed to like post');
  }
};

PostSchema.methods.unlikePost = async function (userId: string) {
  try {
    await this.updateOne({ $pull: { likes: userId } }); // Use $pull to unlike the post
  } catch (error) {
    throw new Error('Failed to unlike post');
  }
};

PostSchema.methods.removePost = async function () {
  try {
    await this.deleteOne();
  } catch (error) {
    throw new Error('Failed to remove post');
  }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: IcommentBase) {
  try {
    // Add comment to the post
    const comment = await Comment.create(commentToAdd);
    this.comments.push(comment._id);
    await this.save();
  } catch (error) {
    throw new Error('Failed to comment on post');
  }
};

PostSchema.methods.getAllComments = async function (): Promise<Icomment[]> {
  try {
    await this.populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });
    return this.comments;
  } catch (error) {
    throw new Error('Failed to get all comments');
  }
};

PostSchema.methods.removeComment = async function (commentId: string) {
  try {
    await this.updateOne({ $pull: { comments: commentId } }); // Remove comment by ID directly
  } catch (error) {
    throw new Error('Failed to remove comment');
  }
};

// Static Methods
PostSchema.statics.getAllPosts = async function (): Promise<IpostDocument[]> {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'comments',
        options: {
          sort: { createdAt: -1 },
        },
      })
      .lean() as Array<{
        _id: mongoose.Types.ObjectId;
        comments: Array<{ _id: mongoose.Types.ObjectId }>;
      }>;

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment) => ({
        ...comment,
        _id: comment._id.toString(), // Convert comment ObjectId to string
      })),
    })) as IpostDocument[];
  } catch (error) {
    throw new Error('Failed to fetch posts');
  }
};

// Index on createdAt for better performance
PostSchema.index({ createdAt: -1 });

// Check if the model already exists, otherwise define it
const Post = (models.Post as IPostModel) || mongoose.model<IpostDocument, IPostModel>('Post', PostSchema);

export default Post;


// Interface for Education
interface IEducation {
  degree: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

// Interface for Work Experience
interface IWorkExperience {
  position: string;
  company: string;
  startDate: Date;
  endDate: Date;
  description?: string;
}

// Interface for Services
interface IService {
  title: string;
  description: string;
}

// Interface for Career Break
interface ICareerBreak {
  reason: string;
  startDate: Date;
  endDate: Date;
}

// Interface for Skill
interface ISkill {
  name: string;
  proficiency: string; // Example: Beginner, Intermediate, Advanced
}

// Base interface for CV
export interface ICVBase {
  userId: string;
  education: IEducation[];
  workExperience: IWorkExperience[];
  services: IService[];
  careerBreak: ICareerBreak[];
  skills: ISkill[];
}

// Extend ICVBase to include Mongoose-specific fields
export interface ICV extends ICVBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Custom methods for the CV model
interface ICVMethods {
  addOrUpdateCV(data: Partial<ICVBase>): Promise<void>;
}

// Static methods for the CV model
interface ICVStatics {
  getUserCV(userId: string): Promise<ICVDocument | null>;
}

// Combined interface for the CV model
export interface ICVDocument extends ICV, ICVMethods {}

// Model interface
interface ICVModel extends ICVStatics, Model<ICVDocument> {}

// Schema for CV
const CVSchema = new Schema<ICVDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Each user can only have one CV
    },
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    workExperience: [
      {
        position: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    services: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    careerBreak: [
      {
        reason: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
      },
    ],
    skills: [
      {
        name: { type: String, required: true },
        proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Instance method to add or update CV
CVSchema.methods.addOrUpdateCV = async function (data: Partial<ICVBase>) {
  try {
    Object.assign(this, data); // Merge the new data with the existing document
    await this.save();
  } catch (error) {
    throw new Error('Failed to add or update CV');
  }
};

// Static method to get the CV by userId
CVSchema.statics.getUserCV = async function (userId: string): Promise<ICVDocument | null> {
  try {
    return await this.findOne({ userId });
  } catch (error) {
    throw new Error('Failed to fetch CV');
  }
};

// Check if the model already exists, otherwise define it
export const CV = (models.CV as ICVModel) || mongoose.model<ICVDocument, ICVModel>('CV', CVSchema);

