import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  friends: string[];
  location: string;
  occupation: string;
  viewedProfile: number;
  impressions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUser, Document {}

export const userMapper = (user: IUserModel) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    picturePath: user.picturePath,
    friends: user.friends,
    location: user.location,
    occupation: user.occupation,
    viewedProfile: user.viewedProfile,
    impressions: user.impressions,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true
    },
    password: {
      type: String,
      required: true,
      min: 6
    },
    picturePath: {
      type: String,
      default: ''
    },
    friends: {
      type: [],
      default: []
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number
  },
  { timestamps: true }
);

const User = mongoose.model<IUserModel>('User', UserSchema);
export default User;
