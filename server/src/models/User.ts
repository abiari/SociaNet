import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  friends: any[];
  location: string;
  occupation: string;
  viewedProfile: number;
  impressions: number;
}

export interface IUserModel extends IUser, Document {}

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
