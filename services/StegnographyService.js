const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
import { clearDirectory } from "../utils/FileRemover";
export const extract = async (req, res) => {
  try {
    let filePath = req.body.path;
    let extension = path.parse(filePath).ext;
    let fileName = path.parse(filePath).name;
    if (fs.existsSync(filePath)) {
      await exec("binwalk -e " + filePath, (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err);
          res.status(500).send();
        } else {
          // the *entire* stdout and stderr (buffered)
          console.log(` ${stdout}`);
          res.status(200).send();
        }
      });
    }
  } catch (err) {
    console.info(err);

    res.status(500).send(err.message);
  }
};

// export const finder = async (req, res) => {
//   try {
//     clearDirectory();
//   } catch (err) {
//     console.info(err);

//     res.status(500).send(err.message);
//   }
// };
