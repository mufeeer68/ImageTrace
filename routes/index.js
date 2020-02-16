import { MetaDataService } from "../services";
const express = require("express");
const path = require("path");
const routes = express.Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

routes.get("/", function(req, res) {
  res.render("index");
});

routes.post("/submit", upload.single("image"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send(file.path);
});

routes.post("/metadata", MetaDataService.getMetadata);
module.exports = routes;
