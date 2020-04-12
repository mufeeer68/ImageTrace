import { MetaDataService, StegnographyService } from "../services";

const ela = require("../services/ErrorLevelAnalysor");
const express = require("express");
const path = require("path");
const routes = express.Router();
const multer = require("multer");
const ElaAnalysor = require("../utils/_process");
const fsExtra = require("fs-extra");
const fs = require("fs");

import { clearDirectory } from "../utils/FileRemover";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

routes.get("/", function (req, res) {
  fsExtra.emptyDirSync("uploads");

  res.render("index");
});

routes.get("/ela", function (req, res) {
  fsExtra.emptyDirSync("uploads");
  res.render("elaIndex");
});

routes.get("/stegno", function (req, res) {
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

routes.get("/exifpdf", function (req, res) {
  // fsExtra.emptyDirSync("uploads");
  let filePath = "uploads/exif.pdf";
  if (fs.existsSync(filePath)) {
    res.status(200).send("exif.pdf");
  } else {
    res.status(500).send("Pdf doesnt exist");
  }
});

routes.post("/metadata", MetaDataService.getMetadata);
routes.post("/imageprocessing", ElaAnalysor.processImage);
routes.post("/stegnography", StegnographyService.extract);
routes.post("/stegnofinder", clearDirectory);
module.exports = routes;
