import {
  MetaDataService,
  ImageProcessingService,
  StegnographyService
} from "../services";
// import { clearDirectory } from "../utils/FileRemover";
const express = require("express");
const path = require("path");
const routes = express.Router();
const multer = require("multer");
const fsExtra = require("fs-extra");

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
  fsExtra.emptyDirSync("uploads");

  res.render("index");
});

routes.get("/ela", function(req, res) {
  fsExtra.emptyDirSync("uploads");
  res.render("elaIndex");
});

routes.get("/stegno", function(req, res) {
  fsExtra.emptyDirSync("uploads");
  res.render("stegnoIndex");
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
routes.post("/imageprocessing", ImageProcessingService.processImage);
routes.post("/stegnography", StegnographyService.extract);
// routes.post("/imageprocessing", clearDirectory);
module.exports = routes;
