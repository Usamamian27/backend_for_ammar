"use strict";
const User = require("./../schema/user");
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const { validate } = require("./../validators/userValidator");

const errorHandler = require("./../utils/errorHandler");
const authMiddleware = require("./../middleware/authMiddleWare");
//define controller Class, initlize it and then export
class UserController {
  //add User /*With salt*/
  // async addUser(req, res) {
  //   try {
  //     let userName = req.body.userName;
  //     let email = req.body.email;
  //     let fullName = req.body.fullName;
  //     let userType = req.body.userType;
  //     let password = req.body.password;
  //     let fieldsForValidator = { userName: userName, email: email };
  //     const { error } = validate(fieldsForValidator);
  //     if (error) return res.status(400).send(error.details[0].message);
  //     let userbyEmail = await User.findOne({
  //       email: email
  //     });
  //     if (userbyEmail != null) {
  //       res.status(400).send({ message: "Email already exists!" });
  //     } else {
  //       let userByName = await User.findOne({ userName: userName });
  //       if (userByName != null) {
  //         res.status(400).send({
  //           message: "User name already exists, try new one!"
  //         });
  //       } else {
  //         const salt = await bcrypt.genSalt(10);
  //         let newUser = new User({
  //           fullName: fullName,
  //           userName: userName,
  //           userType: userType,
  //           email: email,
  //           password: await bcrypt.hash(password, salt)
  //         });
  //         console.log(salt);
  //         console.log("Passord after salt is ", newUser.password);
  //         await newUser.save();
  //         res.status(200).json(newUser);
  //       }
  //     }
  //   } catch (error) {
  //     // errorHandler.sendRawError(error);
  //     console.log(error);
  //   }
  // }
  //add User /*WithOut salt*/
  async addUser(req, res) {
    try {
      let userName = req.body.userName;
      let email = req.body.email;
      let fullName = req.body.fullName;
      let userType = req.body.userType;
      let password = req.body.password;
      let fieldsForValidator = { userName: userName, email: email };
      const { error } = validate(fieldsForValidator);
      if (error) return res.status(400).send(error.details[0].message);
      let userbyEmail = await User.findOne({
        email: email
      });
      if (userbyEmail != null) {
        res.status(400).send({ message: "Email already exists!" });
      } else {
        let userByName = await User.findOne({ userName: userName });
        if (userByName != null) {
          res.status(400).send({
            message: "User name already exists, try new one!"
          });
        } else {
          let newUser = new User({
            fullName: fullName,
            userName: userName,
            userType: userType,
            email: email,
            password: bcrypt.hashSync(password, 10)
          });
          await newUser.save();
          res.status(200).json(newUser);
        }
      }
    } catch (error) {
      // errorHandler.sendRawError(error);
      console.log(error);
    }
  }

  //get Users
  async getAllUsers(req, res) {
    try {
      let users = await User.find()
        .sort({ createdAt: -1 })
        .populate("posts");
      res.status(200).json(users);
    } catch (error) {
      errorHandler.sendRawError(error);
    }
  }
  //get user by Id

  async getUserById(req, res) {
    try {
      let id = req.params.id;
      // console.log(id);
      let user = await User.findById(id);
      if (user == null) {
        res.status(404).json({ message: "Data against this ID isn't found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      // res.send(error);
      errorHandler.sendRawError(error);
    }
  }
  //get userByCatagory

  async getUserByType(req, res) {
    try {
      let userType = req.params.userType;
      // console.log(id);
      let user = await User.find({
        userType: userType
      });
      // if (user == null) {
      // res
      // .status(404)
      //.json({ message: "Data against this userType isn't found" });
      //} else {
      res.status(200).json(user);
      //}
    } catch (error) {
      res.send(error);
      // errorHandler.sendRawError(error);
    }
  }

  //get user and update

  async updateUserById(req, res) {
    try {
      let id = req.params.id;
      let userName = req.body.userName;
      let email = req.body.email;
      let fullName = req.body.fullName;
      let userType = req.body.userType;
      let password = req.body.password;
      let body = {
        fullName: fullName,
        userName: userName,
        userType: userType,
        email: email,
        password: bcrypt.hashSync(password, 10)
      };
      console.log(body);
      let user = await User.findOneAndUpdate(id, body, {
        new: true
      });
      res.status(200).send(user);
    } catch (error) {
      res.send(error);
    }
  }
  //update passeword logic left (non functional req)
  //delete user
  async deleteUser(req, res) {
    try {
      let id = req.params.id;
      let user = await User.findByIdAndDelete(id);
      res.send(user);
    } catch (error) {
      // errorHandler.sendRawError(error);
      console.log(error);
    }
  }
  //logIn
  async signIn(req, res) {
    try {
      let email = req.body.email;
      let password = req.body.password;
      let user = await User.findOne({
        email: email
      });
      if (user == null) {
        res.status(404).json({
          message: "User against provided Email is not found.Try again"
        });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          let jwt = authMiddleware.createJWT(user);
          res.send({ token: jwt });
        } else {
          res.status(400).json({ message: "Password is incorrect" });
        }
      }
    } catch (error) {
      errorHandler.sendRawError(error);
    }
  }
  //check user
  async checkUser(req, res) {
    try {
      let token = req.body.token;
      if (token == null)
        throw {
          code: 401,
          message: "You are not authorized to make this request"
        };
      let decodedToken = authMiddleware.decodeJWT(token);
      let user = await User.findOne({ _id: decodedToken.sub });
      // console.log(user);
      if (user == null) res.json({ authenticated: false });
      else
        res.json({
          authenticated: true
        });
    } catch (error) {
      res.json({ authenticated: false });
    }
  }
  //profile
  async profile(req, res) {
    try {
      let token = req.body.token;
      if (token == null)
        throw {
          code: 401,
          message: "You are not authorized to make this request"
        };
      let decodedToken = authMiddleware.decodeJWT(token);
      let user = await User.findOne({ _id: decodedToken.sub });
      if (user == null)
        throw {
          code: 401,
          message: "You are not authorized to make this request"
        };
      else res.json(user);
    } catch (error) {
      errorHandler.sendRawError(error);
    }
  }
  async logOut(req, res) {
    try {
      let user = await User.findById(req.query.userId);
      if (user == null) throw { code: 400, message: "Incorrect user id" };
      else
        await User.findByIdAndUpdate(req.query.userId, {
          $set: { token: null }
        });
      res.send({ message: "Logged out successfully!" });
    } catch (error) {
      res.send({ message: error });
    }
  }

    async SignUp(req, res) {
        try {
          console.log('herer')
            let userName = req.body.userName;
            let email = req.body.email;
            let fullName = req.body.fullName;
            let password = req.body.password;
            let fieldsForValidator = { userName: userName, email: email };
            const { error } = validate(fieldsForValidator);
            if (error) return res.status(400).send(error.details[0].message);
            let userbyEmail = await User.findOne({
                email: email
            });
            if (userbyEmail != null) {
                res.status(400).send({ message: "Email already exists!" });
            } else {
                let userByName = await User.findOne({ userName: userName });
                if (userByName != null) {
                    res.status(400).send({
                        message: "User name already exists, try new one!"
                    });
                } else {
                    let newUser = new User({
                        fullName: fullName,
                        userName: userName,
                        email: email,
                        password: bcrypt.hashSync(password, 10)
                    });
                    await newUser.save();
                    res.status(200).json(newUser);
                }
            }
        }
        catch (error) {
            // errorHandler.sendRawError(error);
            console.log(error);
        }

    }



}

const userController = new UserController();
module.exports = userController;
