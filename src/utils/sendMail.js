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

const sendMail = (receiver, faculty, contribution) => {
  const mail = {
    from: {
      name: "COMP1640",
      address: process.env.MAIL_ADDRESS,
    },
    to: receiver,
    subject: "A contribution is submitted",
    html: `<p>Faculty name: <b>${faculty.name}</b></p>
    <p>Contribution content: <b>${contribution.content}</b></p>
    ${
      contribution.files.length > 0
        ? `<p>Files:</p>
      <ul>
        ${contribution.files.map((file) => {
          return `<li>${file}</li>`;
        })}
      </ul>`
        : ""
    }`,
  };

  transport.sendMail(mail, (err, info) => {
    if (err) {
      console.error(`Error: ${err}`);
    } else {
      console.info(`Response: ${info}`);
    }
  });
};

module.exports = sendMail;
