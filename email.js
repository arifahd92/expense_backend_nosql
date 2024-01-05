const nodemailer = require("nodemailer");
console.log("first")
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arifahd92@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
function sendEmail(to, subject, message) {
  let mailDetails = {
    from: "arifahd92@gmail.com",
    to,
    subject,
    text: message,
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log(err.message);
    } else {
      console.log("email sent from email file");
    }
  });
}
//sendEmail("mdarif7312@gmail.com", 'reset password', "hi how r you");
module.exports = { sendEmail };
//import and call with three parameter=> to(whome u want to send email), subject(for which purpose it is being sent), actual message
