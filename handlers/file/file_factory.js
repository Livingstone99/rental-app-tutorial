const { AWSFileHandler } = require("./upload");
class FileFactory {
  create(type) {
    switch (type) {
      case "aws":
        return new AWSFileHandler();

      case "cloudinary":
        return new "CloudinaryFileHandler"();
    }
  }
}

module.exports = { FileFactory };
