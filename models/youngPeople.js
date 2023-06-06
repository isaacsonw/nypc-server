const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  fixed: {
    type: Number,
    default: 0
  },
  paid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  }
});

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    trim: true
  },
  age: {
    type: Number
  },
  date_of_birth: {
    type: String
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Locality"
  },
  state: {
    type: String
  },
  amount: paymentSchema,
  coordinators: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  }
});

const YoungPeople =
  mongoose.models.YoungPeople || mongoose.model("YoungPeople", userSchema);

module.exports = { YoungPeople };
