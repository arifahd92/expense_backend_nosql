//core module
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");
//third party module
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const compression = require("compression");
//local file import
const connectToMongoDB = require("./db/connection");
//routes
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const expenseRouter = require("./routes/expense");
const verifyRouter = require("./routes/verify");
const razorRouter = require("./routes/razor");
const premiumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");

console.log("index.js file");
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
connectToMongoDB()
  .then(() => {
    app.listen(4000, () =>
      console.log("connection successfull and listening at port 4000")
    );
  })
  .catch((error) => console.log(error.message));
