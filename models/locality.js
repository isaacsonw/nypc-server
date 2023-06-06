const mongoose = require("mongoose");

const localitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Locality name is required"],
    trim: true
  },
  coordinators: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },

  youngPeople: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "YoungPeople"
  },

  state: {
    type: String,
    required: [true, "State is required"]
  }
});

const Locality =
  mongoose.models.Locality || mongoose.model("Locality", localitySchema);

module.exports = { Locality };
