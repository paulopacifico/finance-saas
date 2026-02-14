/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./public/landing/images";
const files = fs.readdirSync(inputDir);

files.forEach((file) => {
  if (file.match(/\.(jpg|jpeg|png)$/)) {
    sharp(path.join(inputDir, file))
      .webp({ quality: 80 })
      .toFile(path.join(inputDir, file.replace(/\.(jpg|jpeg|png)$/, ".webp")))
      .then(() => console.log(`Converted ${file}`));
  }
});
