const { sendEmail } = require("../email");
const { ForgotPassword } = require("../models/password");
const User = require("../models/user");
//const sendinBlueApiKey = process.env.API_KEY;

//const axios = require("axios");
const saltRounds = 10;
const bcrypt = require("bcrypt");
//update password***************
const updatePassword = async (req, res) => {
  try {
    const { password, cnfPassword, reqId } = req.body;
    console.log(password, cnfPassword, reqId);
    const passwordData = await ForgotPassword.findByPk(reqId);
    const userId = passwordData.userId;
    const isActive = passwordData.isActive;
    if (isActive) {
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Password hashing failed" });
        }

        const [usercount] = await User.update(
          { password: hashedPassword },
          { where: { id: userId } }
        );
        const [passwordcount] = await ForgotPassword.update(
          {
            isActive: false,
          },
          { where: { userId } }
        );
        if (usercount != 0 && passwordcount != 0) {
          return res.send({ message: "success" });
        }
        console.log("returning failed");
        return res.send({ message: "failed" });
      });
    } else {
      return res.send({ message: "link expired" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "internal server error" });
  }
};
//m-post=>password/forgot-password
//send a link to user to reset password
const forgotPassword = async (req, res) => {
  try {
    const { email: to } = req.body; //destructure and assign
    const user = await User.findOne({ where: { email: to } });
    const forgotPassword = await ForgotPassword.create({
      isActive: true,
      userId: user.id,
    });
    // console.log (forgotPassword);
    const requestId = forgotPassword.id;
    //console.log ({to});
    console.log("visit at ");
    if (user && forgotPassword) {
      console.log(`http://localhost:3000/password/reset-password/${requestId}`);
      sendEmail(
        to,
        "ressetting password",
        `http://localhost:3000/password/reset-password/${requestId}`
      );
      //console.log(sendinBlueApiKey);
    }
    if (!user) {
      return res.json({ message: "you are not a registered user" });
    }
    console.log("password recovery email sent");
    res.send({ message: "chec your email", requestId: requestId });
  } catch (error) {
    console.log(error.message);
    res.json({ message: "you are not a registered user from catch" });
  }
};
module.exports = { updatePassword, forgotPassword };
