const mongoose = require("mongoose");

const LapSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  lap: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lap", LapSchema);
