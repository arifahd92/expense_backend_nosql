const bcrypt = require("bcryptjs");
const { ForgotPassword } = require("../models/password");
const User = require("../models/user");

const saltRounds = 10;

const updatePassword = async (req, res) => {
  try {
    const { password, cnfPassword, reqId } = req.body;
    console.log(password, cnfPassword, reqId);

    // Find the related User based on the ForgotPassword entry
    const passwordData = await ForgotPassword.findById(reqId).populate("user");
    const userId = passwordData.user._id;
    const isActive = passwordData.isActive;

    if (isActive) {
      bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Password hashing failed" });
        }

        try {
          // Update the user's password
          const userUpdateResult = await User.updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
          );

          // Update all related ForgotPassword entries to mark them as inactive
          const passwordUpdateResult = await ForgotPassword.updateMany(
            { creator: userId },
            { $set: { isActive: false } }
          );

          if (userUpdateResult.nModified !== 0 && passwordUpdateResult.nModified !== 0) {
            return res.send({ message: "success" });
          } else {
            console.log("returning failed");
            return res.send({ message: "failed" });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      });
    } else {
      return res.send({ message: "link expired" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "internal server error" });
  }
};

module.exports = { updatePassword };

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
