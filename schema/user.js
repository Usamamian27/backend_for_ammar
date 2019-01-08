const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    userName: String,
    userType: {
      type: String,
      required: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "post"
      }
    ],
    commentedOn: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment"
      }
    ],
    token: String
  },
  {
    timestamps: true
  }
);
let User = mongoose.model("user", userSchema);
module.exports = User;
