export const processImage = async (req, res) => {
  var imageData = context.getImageData(
    imageX,
    imageY,
    image.width,
    image.height
  );
  var dataArr = imageData.data;

  imageData.writeAsync(
    filePath.slice(0, -extension.length) + "_threshold" + extension
  ); // Re

  try {
    let filePath = req.body.path;
    let extension = path.parse(filePath).ext;
    let name = path.parse(filePath).name;

    if (fs.existsSync(filePath)) {
      await convertToNegative(filePath);
      await convertToGreyscale(filePath);
      await colorFn([(apply = "red")], filePath);
      await colorFn([(apply = "green")], filePath);
      await colorFn([(apply = "blue")], filePath);
      await convertThreshold(filePath);

      let returnPaths = [
        name + "_negative" + extension,
        name + "_greyscale" + extension,
        name + "_red" + extension,
        name + "_green" + extension,
        name + "_blue" + extension,
        name + "_threshold" + extension,
        name + extension,
      ];
      res.status(200).send(returnPaths);
      //   await convertThreshold(filePath);
    } else {
      res.status(500).send("File not saved in directory");
    }
  } catch (err) {
    console.info(err);

    res.status(500).send(err.message);
  }
};

export function scan(image, x, y, w, h, f) {
  x = Math.round(x);
  y = Math.round(y);
  w = Math.round(w);
  h = Math.round(h);

  for (let _y = y; _y < y + h; _y++) {
    for (let _x = x; _x < x + w; _x++) {
      const idx = (image.bitmap.width * _y + _x) << 2;
      f.call(iamge, _x, _y, idx);
    }
  }

  return image;
}

import { isNodePattern } from "@jimp/utils";

export const convertToNegative = () => ({
  invert(cb) {
    this.scanQuiet(0, 0, this.bitmap.width, this.bitmap.height, function (
      x,
      y,
      idx
    ) {
      this.bitmap.data[idx] = 255 - this.bitmap.data[idx];
      this.bitmap.data[idx + 1] = 255 - this.bitmap.data[idx + 1];
      this.bitmap.data[idx + 2] = 255 - this.bitmap.data[idx + 2];
    });

    if (isNodePattern(cb)) {
      cb.call(this, null, this);
    }

    return this;
  },
});

export function convertToGreyscale(cb) {
  this.scanQuiet(0, 0, this.bitmap.height, function (x, y, idx) {
    const grey = parseInt(
      0.2126 * this.bitmap.data[idx] +
        0.7152 * this.bitmap.data[idx + 1] +
        0.0722 * this.bitmap.data[idx + 2]
    );

    this.bitmap.data[idx] = grey;
    this.bitmap.data[idx + 1] = grey;
    this.bitmap.data[idx + 2] = grey;
  });

  if (isNodePattern(cb)) {
    cb.call(this, null, this);
  }

  return this;
}

export function ConvertThreshold(cb) {
  this.scanQuiet(0, 0, this.bitmap.height, function (x, y, idx) {
    w2 = scan(this.bitmap.height, x, y);

    for (y = 0; y < height; y++) {
      inpos = y * width * 4;
      outpos = inpos + w2 * 4;

      for (x = 0; x < w2; x++) {
        r = this.bitmap.data[idx];
        g = this.bitmap.data[idx + 1];
        b = this.bitmap.data[idx + 2];

        a = this.bitmap.data[inpos++];
        const grey = parseInt(
          0.2126 * this.bitmap.data[idx] +
            0.7152 * this.bitmap.data[idx + 1] +
            0.0722 * this.bitmap.data[idx + 2]
        );

        if (grey > 120) {
          this.bitmap.data[outpos++] = 1;
          this.bitmap.data[outpos++] = a;
        } else {
          this.bitmap.data[outpos++] = 0;
          this.bitmap.data[outpost++] = a;
        }
      }

      this.bitmap.data[idx] = grey;
    }
  });
}

export function colorFn(actions, cb) {
  if (!actions || !Array.isArray(actions)) {
    return throwError.call(this, "actions must be an array", cb);
  }

  actions = actions.map((action) => {
    if (action.apply === "xor" || action.apply === "mix") {
      action.params[0] = tinyColor(action.params[0]).toRgb();
    }

    return action;
  });

  this.scanQuiet(0, 0, this.bitmap.width, this.bitmap.height, (x, y, idx) => {
    let clr = {
      r: this.bitmap.data[idx],
      g: this.bitmap.data[idx + 1],
      b: this.bitmap.data[idx + 2],
    };

    const colorModifier = (i, amount) =>
      this.constructor.limit255(clr[i] + amount);

    actions.forEach((action) => {
      if (action.apply === "mix") {
        clr = mix(clr, action.params[0], action.params[1]);
      } else if (action.apply === "tint") {
        clr = mix(clr, { r: 255, g: 255, b: 255 }, action.params[0]);
      } else if (action.apply === "shade") {
        clr = mix(clr, { r: 0, g: 0, b: 0 }, action.params[0]);
      } else if (action.apply === "xor") {
        clr = {
          r: clr.r ^ action.params[0].r,
          g: clr.g ^ action.params[0].g,
          b: clr.b ^ action.params[0].b,
        };
      } else if (action.apply === "red") {
        clr.r = colorModifier("r", action.params[0]);
      } else if (action.apply === "green") {
        clr.g = colorModifier("g", action.params[0]);
      } else if (action.apply === "blue") {
        clr.b = colorModifier("b", action.params[0]);
      } else {
        if (action.apply === "hue") {
          action.apply = "spin";
        }

        clr = tinyColor(clr);

        if (!clr[action.apply]) {
          return throwError.call(
            this,
            "action " + action.apply + " not supported",
            cb
          );
        }

        clr = clr[action.apply](...action.params).toRgb();
      }
    });

    this.bitmap.data[idx] = clr.r;
    this.bitmap.data[idx + 1] = clr.g;
    this.bitmap.data[idx + 2] = clr.b;
  });

  if (isNodePattern(cb)) {
    cb.call(this, null, this);
  }

  return this;
}
