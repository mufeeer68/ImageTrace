import { MetaDataService } from "./services";

const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");

app.set("view engine", "ejs");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, "uploaded_image" + path.parse(file.originalname).ext);
  }
});

var upload = multer({ storage: storage });

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/submit", upload.single("image"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  const data = req.body;

  res.send(data);
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
