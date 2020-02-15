const fs = require("fs");
const path = require("path");
const pngToJpeg = require("png-to-jpeg");
const Jimp = require("jimp");
const gm = require("gm");

export const processImage = async (req, res) => {
  try {
    let filePath = req.body.path;
    if (fs.existsSync(filePath)) {
      await convertToNegative(filePath);
      await convertToGreyscale(filePath);
      await convertToRed(filePath);
      await convertToGreen(filePath);
      await convertToBlue(filePath);

      //   await convertThreshold(filePath);
    } else {
      res.status(500).send("File not saved in directory");
    }
  } catch (err) {
    console.info(err);

    res.status(500).send(err.message);
  }
};

const convertToNegative = async filePath => {
  let extension = path.parse(filePath).ext;
  try {
    Jimp.read(filePath)
      .then(image => {
        image.invert();
        image.writeAsync(
          filePath.slice(0, -extension.length) + "_negative" + extension
        ); // Returns Promise
      })
      .catch(err => {
        console.log("Error: " + err.message);
        // Handle an exception.
      });
  } catch (err) {
    console.log(err.message);
  }
};

const convertToGreyscale = async filePath => {
  let extension = path.parse(filePath).ext;

  try {
    Jimp.read(filePath)
      .then(image => {
        image.greyscale();
        image.writeAsync(
          filePath.slice(0, -extension.length) + "_greyscale" + extension
        ); // Returns Promise
      })
      .catch(err => {
        console.log("Error: " + err.message);
        // Handle an exception.
      });
  } catch (err) {
    console.log(err.message);
  }
};

const convertToRed = async filePath => {
  let extension = path.parse(filePath).ext;

  try {
    Jimp.read(filePath)
      .then(image => {
        image.color([{ apply: "red", params: [255] }]);
        image.writeAsync(
          filePath.slice(0, -extension.length) + "_red" + extension
        ); // Returns Promise
      })
      .catch(err => {
        console.log("Error: " + err.message);
        // Handle an exception.
      });
  } catch (err) {
    console.log(err.message);
  }
};

const convertToGreen = async filePath => {
  let extension = path.parse(filePath).ext;

  try {
    Jimp.read(filePath)
      .then(image => {
        image.color([{ apply: "green", params: [255] }]);
        image.writeAsync(
          filePath.slice(0, -extension.length) + "_green" + extension
        ); // Returns Promise
      })
      .catch(err => {
        console.log("Error: " + err.message);
        // Handle an exception.
      });
  } catch (err) {
    console.log(err.message);
  }
};

const convertToBlue = async filePath => {
  let extension = path.parse(filePath).ext;

  try {
    Jimp.read(filePath)
      .then(image => {
        image.color([{ apply: "blue", params: [255] }]);
        image.writeAsync(
          filePath.slice(0, -extension.length) + "_blue" + extension
        ); // Returns Promise
      })
      .catch(err => {
        console.log("Error: " + err.message);
        // Handle an exception.
      });
  } catch (err) {
    console.log(err.message);
  }
};
