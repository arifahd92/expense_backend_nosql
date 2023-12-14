const jwt = require("jsonwebtoken");
const User = require("../models/user");

// m-post => /verify-user
const verify = async (req, res) => {
  const { id, email } = req.body;
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    const userEmail = decodedToken.email;
    const userId = decodedToken.id;

    const user = await User.findById(userId);

    if (!user || userEmail !== email) {
      // Token valid, but user not found or email doesn't match
      return res.json({ message: "Token is invalid", verification: false });
    }

    // Token is valid, and user is found
    return res.json({ message: "Token is valid", verification: true });
  } catch (error) {
    // Token is invalid or expired
    console.log(error.message);
    res.status(401).json({ error: "Unauthorized", verification: false });
  }
};

module.exports = { verify };
