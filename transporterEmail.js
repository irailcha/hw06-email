const nodemailer = require('nodemailer');

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);
const sendEmail = data => {
  const email = {...data, from: process.env.EMAIL};
  return transporter.sendMail(email)
}

  module.exports = {
    sendEmail
  };