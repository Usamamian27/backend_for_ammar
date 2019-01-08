const Comments = require("../schema/comments");
const Post = require("../schema/post");
const User = require("../schema/user");
class CommentController {
  async addComment(req, res) {
    try {
      const userId = req.body.userId;
      const postId = req.body.postId;
      const text = req.body.comment;
      console.log(req.body)
      const comment = new Comments(req.body);
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
      comment.post = post;
      comment.commentedBy = user;
      await comment.save();
      await post.commentsGot.push(comment);
      await user.commentedOn.push(comment);
      await post.save();
      await user.save();
      res.status(200).json({
        message: "Comment added  Successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }
  //get comment by id
  async getCommentById(req, res) {
    try {
      console.log('Comment works');
      let idd = req.params.id;
      console.log(idd);
        Post.findOne({_id: idd}).then((resa) => {
                console.log(resa.commentsGot);
                Comments.find({_id:{$in:resa.commentsGot}}).then(resp => {
                  console.log(resp);
                    res.send(resp);
                })
                // comentsid = resa.commentsGot



      })
      // let comments = await Post.findOne(id);
      // console.log(comments);

      // let size = comments.length;
      // if (size === 0) {
      //   res.status(404).json({
      //     message: "Comment not found!"
      //   });
      // } else {
      //   res.status(200).json(comments);
      // }
    } catch (error) {
      res.send(error);
    }
  }
}

let commentController = new CommentController();
module.exports = commentController;
