const { Locality } = require("../models/locality");

const add = async (req, res) => {
  try {
    const { name, state, coordinator } = req.body;

    let locality = await Locality.findOne({ name, state });

    if (!locality) {
      // Create the locality
      locality = Locality.create({
        name,
        state,
        coordinators: [coordinator]
      });
    } else {
      // Add the coordinator to the locality
      locality.coordinators.push(coordinator);
      await locality.save();
    }

    res.status(201).json({ locality });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLocalities = async (req, res) => {
  try {
    const localities = await Locality.find({}).populate("coordinators", {
      firstName: 1,
      lastName: 1,
      email: 1,
      phone: 1
    });

    res.status(200).json({ localities });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLocality = async (req, res) => {
  try {
    const { id } = req.params;

    const locality = await Locality.findOne({ _id: id }).populate(
      "coordinators",
      {
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1
      }
    );

    res.status(200).json({ locality });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { add, getLocalities, getLocality };
