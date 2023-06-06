const { YoungPeople } = require("../models/youngPeople");
const isAuth = require("../utils/isAuth");

const addYoungPerson = async (req, res) => {
  try {
    const { full_name, email, phone, age, date_of_birth, state, amount } =
      req.body;
    const existingUser = await YoungPeople.findOne({ email, full_name, age });
    if (existingUser) {
      return res.status(400).json({ error: "Young Person already exists" });
    }

    const coordinator = await isAuth(req);
    if (!coordinator) {
      return res.status(400).json({
        error:
          "Coordinator must logged in or signed up to perform this operation"
      });
    }

    const youngPerson = await YoungPeople.create({
      full_name,
      email,
      phone,
      age,
      date_of_birth,
      state,
      amount,
      coordinators: [coordinator._id]
    });

    await fetch("http://localhost:4200/api/v1/locality/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: coordinator.locality?.name,
        state,
        youngPerson: youngPerson._id,
        coordinator: coordinator._id
      })
    });

    res.status(201).json({ youngPerson });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getYoungpeople = async (req, res) => {
  try {
    const coordinator = await isAuth(req);
    if (!coordinator) {
      return res.status(400).json({
        error:
          "Coordinator must logged in or signed up to perform this operation"
      });
    }
    const youngPeople = await YoungPeople.find({})
      .populate("locality", {
        name: 1
      })
      .populate("coordinators", {
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1
      });

    res.status(200).json({ youngPeople });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addYoungPerson,
  getYoungpeople
};
