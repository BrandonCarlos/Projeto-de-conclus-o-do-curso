const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "52f6a7f49cf37b",
    pass: "c8a44a7558bde4"
  }
})
