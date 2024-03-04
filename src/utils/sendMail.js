const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const transport = nodemailer.createTransport(
  mg({
    auth: {
      api_key: process.env.MAIL_KEY,
      domain: process.env.MAIL_DOMAIN,
    },
  })
);

const sendMail = (receiver, content) => {
  const mail = {
    from: {
      name: "COMP1640-2024",
      address: "thanhntgcs190601@fpt.edu.vn",
    },
    to: receiver,
    subject: "A contribution is submitted",
    // html: "<b>Wow Big powerful letters</b>",
    text: content,
  };
  console.log(mail);

  transport.sendMail(mail, (err, info) => {
    if (err) {
      console.error(`Error: ${err}`);
    } else {
      console.log(`Response: ${info}`);
    }
  });
};

module.exports = sendMail;
