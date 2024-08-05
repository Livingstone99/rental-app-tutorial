const AWS = require("aws-sdk");
const dotenv = require("dotenv");

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

dotenv.config();

class FileHandlers {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4"
    });
  }

  async upload(file, fileName) {}

  async delete(fileName) {}
}

class AWSFileHandler extends FileHandlers {
  constructor() {
    super();
  }

  async upload(file, fileName, ContentType, path) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: path + fileName,
      Body: file,
      Expires: 60,
      ACL: "public-read",
      ContentType
    };
    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async upload64(file, path) {
    const base64Data = new Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = file.split(";")[0].split("/")[1];

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: uuidv4() + "." + type,
      Body: base64Data,
      Expires: 60,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/jpg`
    };
    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async delete(fileName) {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName
    };
    const data = await this.s3.deleteObject(params).promise();
    return data;
  }
}

module.exports = { AWSFileHandler };
