const fs = require("fs");
const path = require("path");

export const clearDirectory = async (req, res) => {
  try {
    let filePath = "uploads/simple.gif";
    let extension = path.parse(filePath).ext;
    let name = path.parse(filePath).name;
    let tempname = "uploads/_" + name + extension + ".extracted";
    const data = [];
    var textData;
    if (fs.existsSync(tempname)) {
      var files = fs.readdirSync(tempname);
      files.forEach(file => {
        if (".rar" == path.parse(file).ext) {
          data.push(tempname + "/" + file);
        } else if (".zip" == path.parse(file).ext) {
          data.push(tempname + "/" + file);
        } else if (".txt" == path.parse(file).ext) {
          textData = fs.readFileSync(tempname + "/" + file).toString();
        }
      });
    }
    res.send({ file: data, text: textData });
  } catch (err) {
    console.info(err);

    res.status(500).send(err.message);
  }
};
