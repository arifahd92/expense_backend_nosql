const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderid: {
    type: String,
  },
  status: String,
  paymentid: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
