const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var postSchema = new Schema(
  {
    title: {
      type: String
    },
    description: {
      type: String
    },
    catagory: {
      type: String,
      default: "Latest"
    },
    photoUrl: String,
    addedByUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    ],
    commentsGot: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment"
      }
    ]
  },
  {
    timestamps: true
  }
);
const Post = mongoose.model("post", postSchema);
module.exports = Post;
