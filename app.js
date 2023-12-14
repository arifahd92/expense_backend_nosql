const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const compression = require("compression");
// files import
const sequelize = require("./db/connection");
//routes
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const expenseRouter = require("./routes/expense");
const verifyRouter = require("./routes/verify");
const razorRouter = require("./routes/razor");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");
const Expense = require("./models/expense");
const User = require("./models/user");
const Order = require("./models/order");
const { ForgotPassword } = require("./models/password");
//************* */

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
); //here a is used to append

// Use Morgan with the write stream
app.use(morgan("combined", { stream: accessLogStream }));
app.use(compression()); //compress file, loading faster, increase bandwidth
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(loginRouter);
app.use(expenseRouter);
app.use(verifyRouter);
app.use(razorRouter);
app.use(premiumRouter);
app.use(passwordRouter);
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);
sequelize
  .sync()
  .then(() => {
    app.listen(4000, (err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log("listening at port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
