const formData = require("form-data");
const Mailgun = require("mailgun.js");

const dotenv = require("dotenv");

dotenv.config();

const sendMailOtp = ({ title, data }) => {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
      url: "https://api.eu.mailgun.net"
    });
    // Define the HTML template as a multiline string
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Nafolo</title>
      <style>
        /* CSS Styles */
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f8f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #333;
          font-size: 24px;
          margin: 0;
          padding: 0;
        }
        .content {
          color: #555;
          font-size: 16px;
        }
        .cta-button {
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          font-size: 16px;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Lamaison | EMAIL OTP</h1>
        </div>
        <div class="content">
          <p>Cher Utilisateur,</p>
          <p>Ceci est un accès par code OTP à votre compte e-mail: ${data.otp}</p>
          <p>Ne partagez pas avec quelqu'un d'autre si ce n'est pas vous qui accédez au compte.</p>
          <p>Lamaison | Powered by Xearth Studio</p>
        </div>
        <div class="footer">
          <p>© 2023 Lamaison. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
    mg.messages
      .create(process.env.MAILGUN_DOMAIN, {
        from: "otp@lamaison.ci",
        to: [data.email],
        subject: title,
        text: "LAMAISON | EMAIL OTP",
        html: htmlTemplate
      })
      .then((msg) => {
        console.log(msg);
        return true;
      }) // logs response data
      .catch((err) => {
        console.log(err);
        return false;
      });
  };
  
  module.exports = {
    sendMailOtp,
  };
  