const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true
  },

  middleName: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Locality"
  },
  state: {
    type: String,
    required: [true, "State is required"]
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { User };
