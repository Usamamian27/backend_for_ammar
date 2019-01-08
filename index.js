"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const mongoose = require("./schema/mongoose");
const api = require("./routes/api");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
const path = require("path");
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true
  })
);
let port = process.env.Port | config.Port;

app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);
// if (process.env.NODE_ENV === "production") {
//   app.use(function(req, res, next) {
//     var protocol = req.get("x-forwarded-proto");
//     protocol == "https"
//       ? next()
//       : res.redirect("https://" + req.hostname + req.url);
//   });
// }

app.use("/api", api);
app
  .listen(port, () => {
    console.log(`Server is listening at ${port}`);
  })
  .on("error", () => console.log(`error in listening at ${port}`));
