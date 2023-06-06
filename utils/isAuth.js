const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const isAuth = async (req) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findOne({ _id: decoded.id })
    .select("-password")
    .populate("locality", {
      name: 1
    });
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  return user;
};

module.exports = isAuth;
