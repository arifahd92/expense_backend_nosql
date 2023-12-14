const Order = require("../models/order");
const Razorpay = require("razorpay");
const User = require("../models/user");
//m-get=> buy-premium
/*
const buyPremium = async (req, res, next) => {
  try {
    console.log ('razors buy premium');
    const rzp = new Razorpay ({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });
    const amount = 3900;

    const createOrder = () => {//returning a promise
      return new Promise ((resolve, reject) => {
        rzp.orders.create ({amount, currency: 'INR'}, (err, order) => {
          if (err) {
            reject (err);
          } else {
            resolve (order);
          }
        });
      });
    };
    const order = await createOrder ();// this is inside async function thats why await

    // Create a Premium record and handle errors
    await Order.create ({
      orderid: order.id,
      status: 'PENDING',
      userId: req.userId,
    });

    res.status (201).json ({order, key_id: rzp.key_id});
  } catch (err) {
    console.error (err);
    res
      .status (403)
      .json ({message: 'Something went wrong', error: err.message});
  }
};
*/
const buyPremium = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 50000, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    console.log({ order });
    const orderInstance = new Order({
      orderid: order.id,
      status: "PENDING",
      userId: req.userId,
    });
    await orderInstance.save();

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};
const paymentSuccess = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    const orderCount = await Order.updateOne(
      { orderid: razorpayOrderId },
      { $set: { status: "successful" } }
    );

    const userCount = await User.updateOne(
      { id: userId },
      { $set: { premium: true } }
    );

    if (orderCount.nModified === 1 && userCount.nModified === 1) {
      res.send({ message: "success" });
    } else {
      res
        .status(400)
        .send({ message: "Failed to update order or user contact us" });
    }
  } catch (error) {
    console.error("Error updating order and user:", error);
    res.status(500).send({ message: "Internal server error contact us" });
  }
};
module.exports = { buyPremium, paymentSuccess };
