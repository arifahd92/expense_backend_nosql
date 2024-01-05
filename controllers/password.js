const bcrypt = require("bcryptjs");
const { ForgotPassword } = require("../models/password");
const User = require("../models/user");
const { sendEmail } = require("../email");
const saltRounds = 10;

const updatePassword = async (req, res) => {
  try {
    console.log('update password called')
    const { password, reqId } = req.body;
    console.log(password, reqId);

    // Find the related User based on the ForgotPassword entry
    const passwordData = await ForgotPassword.findById(reqId).populate("creator");
    if (!passwordData) {
      return res.status(404).json({ error: "ForgotPassword entry not found" });
    }
 console.log({passwordData})
    const userId = passwordData.creator._id;
    const isActive = passwordData.isActive;

    if (isActive) {
      try {
        // Update the user's password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userUpdateResult = await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

        // Update all related ForgotPassword entries to mark them as inactive
        const passwordUpdateResult = await ForgotPassword.updateMany({ creator: userId }, { $set: { isActive: false } });

        if (userUpdateResult.n !== 0 && passwordUpdateResult.n !== 0) {
          return res.send({ message: "success" });
        } else {
          console.log("returning failed");
          return res.send({ message: "failed" });
        }
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      return res.send({ message: "link expired" });
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email: to } = req.body;
    console.log(to);
    const user = await User.findOne({ email: to });
    console.log({ user });

    if (!user) {
      return res.json({ message: "you are not a registered user" });
    }

    const forgotPassword = await ForgotPassword.create({
      isActive: true,
      creator:user._id
      
    });
    // Push the newly created password ID into the user's passwords array
    console.log({forgotPassword})
    await User.updateOne(
      { _id: user._id },
      { $push: { passwords: forgotPassword._id } }
    );
   
    const requestId = forgotPassword._id;
      
    if (user && forgotPassword) {
      const resetLink = `https://expense-frontend-drab.vercel.app/password/reset-password/${requestId}`;
      console.log(resetLink);
      sendEmail(to, "resetting password", resetLink);
    }

    console.log("password recovery email sent");
    res.send({ message: "check your email", requestId });
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
};

module.exports = { updatePassword, forgotPassword };
