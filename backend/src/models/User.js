import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['visitor', 'user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Remove password from JSON output and convert _id to id
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
