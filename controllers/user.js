const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const useJWTToken = async (id, expires) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expires
  });
  return token;
};

const create = async (req, res) => {
  const SALT = 10;
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = await User.create({ email, password: hashedPassword });

    const token = useJWTToken(user._id, "1h");
    const { password: userPassword, ...rest } = user;
    res.status(201).json({ rest, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { password: userPassword, ...rest } = user;

    const newToken = useJWTToken(user._id, "1h");

    res.status(200).json({ rest, token: newToken });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = useJWTToken(userExist._id, "1h");
    const { password: userPassword, ...rest } = userExist;
    res.status(200).json({ rest, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  create,
  getUser,
  login
};
