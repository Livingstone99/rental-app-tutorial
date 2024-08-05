const Axios = require("axios");

const sendSmsCi = async ({ dest, message, title }) => {
  try {
    const response = await Axios.post(
      "https://sms.acim-ci.net:8443/api/addOneSms",
      {
        Username: process.env.ACIM_USERNAME,
        Token: process.env.ACIM_TOKEN,
        Dest: dest,
        Sms: message,
        Flash: "0",
        Sender: process.env.ACIM_EXP,
        title: title
      },
      {}
    );

    console.log(response.data);
    if (!response) {
      throw new Error("Failed to send sms");
    }

    return response.data.Etat;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  sendSmsCi
};
