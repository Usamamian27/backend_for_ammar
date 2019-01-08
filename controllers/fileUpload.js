const multer = require("multer");
const fs = require("fs");

class FileUploader {
  constructor() {}
  uploadFile(req, res, next) {
    try {
      if (!fs.existsSync("public/uploads")) {
        fs.mkdirSync("public/uploads");
      }
      //stores
      let storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, "public/uploads");
        },
        //determines file name
        filename: function(req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
        }
      });
      let upload = multer({
        storage: storage
      });
      //determines how many pic should come
      //for single
      // upload.array("uploadedImages", 10);
      return upload.single("file")(req, res, next);
      //for many
      // return upload.array("file", 1000)(req, res, next);
    } catch (error) {
      res.send({
        message: "Error! Please try again!"
      });
    }
  }

  async sendResponse(req, res, next) {
    try {
      res.send({
        url: `${req.protocol + "://" + req.get("host")}/public/uploads/${
          req.file.filename
        }`
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const fileUploader = new FileUploader();
module.exports = fileUploader;
