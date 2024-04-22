const nodemailer = require("nodemailer");
// const asyncHandler = require("express-async-handler");

// const sendemail = (options) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // Use `true` for port 465, `false` for all other ports
//     auth: {
//       user: "abdo.aboerba@gmail.com",
//       pass: "123567ty",
//     },
//   });

//   const mailoption = {
//     from: "E-Shopp App <abdo.aboerba@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };
//   transporter.sendMail(mailoption, (error, info) => {
//     if (error) {
//       console.error("Error occurred while sending email:", error);
//       // Handle error here, e.g., return an error response to the client
//     } else {
//       console.log("Email sent successfully:", info.response);
//       // Send success response to the client if needed
//     }
//   });
// };

// module.exports = sendemail;
// const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: "E-shop App <abdo.aboerba@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
