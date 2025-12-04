import mongoose from 'mongoose';
import { USER_ROLE } from '../constants/user.js';

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: USER_ROLE,
      default: 'CUSTOMER',
    },
    bio: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
    },
    refreshToken:{
      type: String,
      default: null,
    }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('users', userSchema);
