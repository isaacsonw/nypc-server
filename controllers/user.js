const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { Locality } = require("../models/locality");
const fetch = require("node-fetch");
// const connectDB = require("../db");

const useJWTToken = async (id, expires) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expires
  });
  return token;
};

const create = async (req, res) => {
  const SALT = 10;
  try {
    const { firstName, lastName, email, phone, password, locality, state } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      state
    });

    await fetch("http://localhost:4200/api/v1/locality/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: locality, state, coordinator: user._id })
    });

    const token = await useJWTToken(user._id, "1h");
    delete user.password;
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findOne({ _id: decoded.id }).populate("locality", {
      name: 1
    });
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const newToken = await useJWTToken(user._id, "1h");

    delete user.password;
    res.status(201).json({ user, token: newToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email }).populate("locality", {
      name: 1
    });

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
    const token = await useJWTToken(userExist._id, "1h");
    delete userExist.password;
    res.status(201).json({ user: userExist, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  getUser,
  login
};
