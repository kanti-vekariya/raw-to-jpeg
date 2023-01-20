const exiftool = require("exiftool-vendored").exiftool;
const dcraw = require("dcraw");
const fs = require("fs");

const convertCr3ToJpgFile = (imagePath, convertInto, targetedDir) => {
  if (!fs.existsSync(targetedDir)) {
    fs.mkdirSync(targetedDir);
  }
  const imageFileName = imagePath.replace(/^.*[\\\/]/, "").split(".")[0];
  const fileExtension = imagePath.replace(/^.*[\\\/]/, "").split(".")[1];
  if (["arw", "ARW"].includes(fileExtension)) {
    const buf = fs.readFileSync(imagePath);
    const thumbnail = dcraw(buf, { extractThumbnail: true });
    fs.writeFileSync(
      `${targetedDir}${imageFileName}.${convertInto}`,
      thumbnail
    );
    return {
      path: `${targetedDir}${imageFileName}.${convertInto}`,
      name: `${imageFileName}.${convertInto}`,
    };
  } else {
    if (imageFileName) {
      exiftool
        .extractJpgFromRaw(
          imagePath,
          `${targetedDir}${imageFileName}.${convertInto}`
        )
        .finally(() => exiftool.end());
      return {
        path: `${targetedDir}${imageFileName}.${convertInto}`,
        name: `${imageFileName}.${convertInto}`,
      };
    }
  }
};

convertCr3ToJpgFile(process.argv[2], process.argv[3],process.argv[4]);
