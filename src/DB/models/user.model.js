import mongoose from "mongoose";

export const userGender = {
  male: "male",
  female: "female",
};
export const userRoles = {
  admin: "admin",
  user: "user",
};
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(userGender),
      default: userGender.female,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [18, 'Age must be at least 18'],
      max: [60, 'Age must be at most 60']
    },
    role: {
       type: String,
      enum: Object.values(userRoles),
      default: userRoles.user,
    },
    confirmed: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;