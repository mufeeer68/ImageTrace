var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
export const pdfsaver = async exifdata => {
  try {
    var html = fs.readFileSync("utils/template.html", "utf8");
    var options = {
      format: "Letter",
      orientation: "portrait",
      border: "10mm",

      footer: {
        height: "15mm",
        contents: {
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>' // fallback value
        }
      }
    };

    var document = {
      html: html,
      data: {
        image: exifdata.image,
        thumbnail: exifdata.thumbnail,
        exif: exifdata.exif,
        gps: exifdata.gps
      },
      path: "uploads/exif.pdf"
    };

    pdf
      .create(document, options)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
  } catch (err) {
    console.info(err);
  }
};
