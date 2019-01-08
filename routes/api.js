"use strict";
const { Router } = require("express");
const userController = require("./../controllers/userController");
const postController = require("./../controllers/postController");
const commentController = require("../controllers/commentsController");
const fileUploadController = require("./../controllers/fileUpload");
const router = new Router();
//user
router.post("/users", userController.addUser);
router.post("/sign-in", userController.signIn);
router.post("/users/profile", userController.profile);
router.post("/users/check", userController.checkUser);
router.post("/users/logout", userController.logOut);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.get("/user-by-catagory/:userType", userController.getUserByType);
router.put("/users/:id", userController.updateUserById);
router.delete("/users/:id", userController.deleteUser);

//posts (news)
router.post("/posts/add", postController.addPost);
router.post("/posts/edit/:id",postController.updatePost);
router.get("/posts", postController.getAllPosts);
router.get("/posts/:id", postController.getDetailedPostById);
router.get("/post-by-catagory/:catagory", postController.getPostByCatagory);
router.delete("/posts/:id", postController.deletePostById);
//Comments
router.post("/posts/add-comment", commentController.addComment);
router.get("/posts/get-comments/:id", commentController.getCommentById);
//file upload
router.post(
  "/files/upload",
  fileUploadController.uploadFile,
  fileUploadController.sendResponse
);

router.post("/signup", userController.SignUp);
// search on admin side created by usama
router.get("/search",postController.search);

module.exports = router;
