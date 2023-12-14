const login = async (req, res) => {
  return res.send({
    message: "success",
    token: req.token,
    userId: req.id,
    premium: req.premium,
  });
};
module.exports = { login };
