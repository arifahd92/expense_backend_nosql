const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secretKey = process.env.JWT_TOKEN;
const findId = async (req, res, next) => {
  try {
    console.log(
      "find id middleware inside authenticate*************************************8"
    );
    const token = req.headers.authorization;
    console.log('generated token',{ token });
    const decodeToken = jwt.verify(token, secretKey);
    const user = await User.findById(decodeToken.id);

   // console.log({ decodeToken });
    req.userId = decodeToken.id;
    req.userEmail = decodeToken.email;
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).send({ error: "Unauthorized", verification: false });
  }
};
module.exports = { findId };
