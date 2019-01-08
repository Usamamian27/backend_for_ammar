const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
var mkdirp = require("mkdirp");
const Post = require("./../schema/post");
const User = require("./../schema/user");
class PostController {
  //adding post!
  async addPost(req, res) {
    try {
      if (!fs.existsSync("public/uploads")) {
        mkdirp("public/uploads", function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Folders Created");
            return res.send({
              message: "Try again Please"
            });
          }
        });
      }
      //taking the body of post
      const newPost = new Post(req.body);
      //taking the user(admin in this case) ID
      const userId = req.body.userId;
      //fetching the User
      const user = await User.findById(userId);
      // console.log(user);
      //assigning ref property to relevent user who is posting the news
      newPost.addedByUser = user;
      //saving the news
      await newPost.save();
      //pushing the news into user profile
      await user.posts.push(newPost);
      //saving it as well
      await user.save();
      res.status(200).send({
        message: "Posted Successfully"
      });
    } catch (error) {
      res.send(error);
    }
  }

  // // edit post
  //   editPost(req, res) {
  //       try {
  //         console.log('Edit post works')
  //         Post.findOne({id:req.params.id})
  //             .then(post=>{
  //                 if(post){
  //                   Post.findOneAndUpdate(
  //                       {post:req.params.id},
  //                       {$set : req.body},
  //                       {new:true}
  //
  //                  )
  //                       .then(post=> res.json(post));
  //                 }
  //                 else {
  //                   return res.json({msg:'Nothing to show'})
  //                 }
  //             });
  //       }
  //       catch (error) {
  //           res.send(error);
  //       }
  //   }

  ///

  //getting the posts!
  async getAllPosts(req, res) {
    try {
      let posts = await Post.find().sort({ createdAt: -1 });
      // if (posts.length == 0) {
      // res.status(404).json({
      // message: "Record not found"
      // });
      // } else
      res.status(200).json(posts);
    } catch (error) {
      res.json(error);
    }
  }
  //get post by catagory!
  async getPostByCatagory(req, res) {
    try {
      let catagory = req.params.catagory;
      let catagoryNews = await Post.find({
        catagory: catagory
      });
      let size = catagoryNews.length;
      if (size === 0) {
        res.status(404).json({
          message: "News not found reltive to this catagory!"
        });
      } else {
        res.status(200).json(catagoryNews);
      }
    } catch (error) {
      res.send(error);
    }
  }
  //get post by id
  async getDetailedPostById(req, res) {
    try {
      let id = req.params.id;
      let newsById = await Post.findById(id);
      switch (newsById) {
        case null:
          res.status(404).json({ message: "News not found!" });
          break;
        default:
          res.status(200).json(newsById);
          break;
      }
    } catch (error) {
      res.send(error);
    }
  }
  //delete
  async deletePostById(req, res) {
    try {
      let id = req.params.id;
      let response = await Post.findByIdAndRemove(id);
      let photoUrl = response.photoUrl;
      let index = photoUrl.indexOf("/public/uploads");
      let path = photoUrl.substr(index);
      console.log(`.${path}`);
      await unlinkAsync(`.${path}`);
      res.status(200).json({
        message: "Deleted Successfully"
      });
    } catch (error) {
      res.send(error);
    }
  }



/// created by usama mian
  // update post
    async updatePost(req, res) {
        try {
            let id = req.params.id;
            let catagory = req.body.catagory;
            let title = req.body.title;
            let description = req.body.description;
            let body = {
                catagory: catagory,
                title: title,
                description: description,
            };
            console.log(body);
            let post = await Post.findOneAndUpdate(id,
                {$set:body}, {
                new: true
            });
            res.status(200).send(post);
        } catch (error) {
            res.send(error);
        }
    }

    // created by usama
    // search method
    search (req,res){
      let sa =req.query.sa;
      console.log(sa);

      Post.find({
        title:{
            $regex : new RegExp(sa)
        }
      },
          {
              _id:0,
              __v:0
          },
          function (err,data) {
              res.json(data)
          }
      ).limit(10);

    }






}
const postController = new PostController();
module.exports = postController;
