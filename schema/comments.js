const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
  {
    comment: {
      type: String
    },
    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "post"
      }
    ],
    commentedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Comments = mongoose.model("comment", CommentsSchema);
module.exports = Comments;
