const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that each email is unique
    trim: true, // Removes leading and trailing whitespaces
    lowercase: true, // Converts the email to lowercase
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic for the password
        return value.length >= 6;
      },
      message: "Password must be at least 6 characters long",
    },
  },
  totalMovieExpense: {
    type: Number,
    default: 0,
  },
  totalShoppingExpense: {
    type: Number,
    default: 0,
  },
  totalRentExpense: {
    type: Number,
    default: 0,
  },
  totalGrocceryExpense: {
    type: Number,
    default: 0,
  },
  totalExpenseAmount: {
    type: Number,
    default: 0,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  passwords: [{ type: mongoose.Schema.Types.ObjectId, ref: "Password" }],
});
const User = mongoose.model("User", userSchema);

module.exports = User;
//expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],// it is equivalent to User.hasMany(Expense)
//for one to many this is optional but it will help to find  all  expenses of a user by userId
