const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); //extracted v4 and assigned it to uuidv4 variable

const forgotPasswordSchema = new mongoose.Schema({
 
  isActive: {
    type: Boolean,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = { ForgotPassword };
