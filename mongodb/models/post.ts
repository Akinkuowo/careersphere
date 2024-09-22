import { Icomment, IcommentBase, Comment } from '@/types/comments';
import { IUser } from '@/types/user';
import mongoose, { Schema, Document, models, Model } from 'mongoose';

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
export interface IpostDocument extends Ipost, IpostMethods {}

// Model interface
interface IPostModel extends IPostStatics, Model<IpostDocument> {}

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
    await this.deleteOne({ _id: this._id }); // Use this.constructor to access the model
  } catch (error) {
    throw new Error('Failed to remove Post');
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
