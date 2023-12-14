const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); //extracted v4 and assigned it to uuidv4 variable

const forgotPasswordSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.String,
    default: uuidv4,
    required: true,
  },
  isActive: {
    type: Boolean,
  },
});

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = { ForgotPassword };
