const { Locality } = require("../models/locality");

const add = async (req, res) => {
  try {
    const { name, city, state } = req.body;
    const locality = await Locality.create({
      name,
      city,
      state
    });
    res.status(201).json({ locality });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
