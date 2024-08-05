const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const pug = require("pug");
const { htmlToText } = require("html-to-text");
const path = require("path");

dotenv.config();

class Email {
  constructor() {
    this.from = `Reprezentme <admin@reprezentme.com>`;
  }

  createTransport() {
    return nodemailer.createTransport({
      host: process.env.MAILGUN_HOST,
      secure: true,
      port: 465,
      tls: {
        rejectUnAuthorized: true,
      },
      auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS,
      },
    });
  }

  // Send the actual email
  async send(template, subject, url) {
    //1) Render html based on pug template
    const html = pug.renderFile(
      path.join(__dirname, "..", "views", "emails", template + ".pug"),
      {
        firstname: this.firstname,
        link: url,
        subject,
      }
    );

    //2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    //3) create a transport and send email
    this.createTransport().sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
        console.log("Message sent: " + response);
        // res.end("sent");
      }
    });
  }

  async sendAdminDetails(name, firstname, email, password) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "views", "emails", "adminDetails.pug"),
      {
        name,
        firstname,
        email,
        password,
      }
    );

    const mailOptions = {
      from: this.from,
      to: email,
      subject: "RepresentMe Admin Details",
      html,
      text: htmlToText(html),
    };

    //3) create a transport and send email
    this.createTransport().sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
        console.log("Message sent: " + response);
        // res.end("sent");
      }
    });
  }

  async sendPasswordResetToken(email, url, link) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "views", "emails", "emailReset.pug"),
      {
        url,
        link,
      }
    );

    const mailOptions = {
      from: this.from,
      to: email,
      subject: "RepresentMe Admin Password Reset",
      html,
      text: htmlToText(html),
    };
    //3) create a transport and send email
    this.createTransport().sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
        console.log("Message sent: " + response);
        // res.end("sent");
      }
    });
  }
}

module.exports = { Email };
