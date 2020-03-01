const ExifImage = require("exif").ExifImage;
const fs = require("fs");
const path = require("path");
const pngToJpeg = require("png-to-jpeg");
import { pdfsaver } from "./../utils/PdfSaver";
export const getMetadata = async (req, res) => {
  try {
    // console.log(req);
    let filePath = req.body.path;
    if (fs.existsSync(filePath)) {
      if (path.parse(filePath).ext == ".png") {
        filePath = await convert(filePath);
      }
      new ExifImage({ image: filePath }, function(error, exifData) {
        if (error) {
          res.status(500).send(error.message);
        }
        pdfsaver(exifData);
        res.send(exifData);
      });
    } else {
      res.status(500).send("File not saved in directory");
    }
  } catch (err) {
    console.info(err);

    res.status(500).send(err.message);
  }
};

const convert = async filePath => {
  let buffer = fs.readFileSync(filePath);
  filePath = filePath.slice(0, -3) + "jpeg";
  try {
    await pngToJpeg({ quality: 90 })(buffer).then(output =>
      fs.writeFileSync(filePath, output)
    );
  } catch (err) {
    console.log(err.message);
  }
  return filePath;
};
