const { Locality } = require("../models/locality");
const { User } = require("../models/user");
const { YoungPeople } = require("../models/youngPeople");

const add = async (req, res) => {
  try {
    const { name, state, coordinator, youngPerson } = req.body;

    let locality = await Locality.findOne({ name, state });
    let user = await User.findOne({ _id: coordinator });
    let young = await YoungPeople.findOne({ _id: youngPerson });

    if (!locality) {
      // Create the locality

      locality = await Locality.create({
        name,
        state,
        youngPeople: youngPerson ? [youngPerson] : [],
        coordinators: [coordinator]
      });
    } else {
      // Add the coordinator to the locality
      youngPerson
        ? locality.youngPeople.push(youngPerson)
        : locality.coordinators.push(coordinator);

      await locality.save();
    }
    const updateQuery = young ? { _id: young?._id } : { _id: user?._id };

    await (young ? YoungPeople : User).findOneAndUpdate(updateQuery, {
      locality: locality._id
    });

    res.status(201).json({ locality });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLocalities = async (req, res) => {
  try {
    const localities = await Locality.find({})
      .populate("youngPeople", {
        full_name: 1,
        age: 1,
        date_of_birth: 1,
        state: 1,
        amount: 1
      })
      .populate("coordinators", {
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

    const locality = await Locality.findOne({ _id: id })
      .populate("youngPeople", {
        full_name: 1,
        age: 1,
        date_of_birth: 1,
        state: 1,
        amount: 1
      })
      .populate("coordinators", {
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1
      });

    res.status(200).json({ locality });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { add, getLocalities, getLocality };
