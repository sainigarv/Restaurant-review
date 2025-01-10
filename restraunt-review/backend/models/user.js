const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  profilePicture: {
    type: String,
    default: "", // URL to default profile picture
  },
  bio: {
    type: String,
    default: "",
    maxLength: 500
  },
  location: {
    type: String,
    default: ""
  },
  phoneNumber: {
    type: String,
    default: ""
  },
  socialLinks: {
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
