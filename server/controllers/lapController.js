const Lap = require("../models/Lap");

exports.saveLaps = async (req, res) => {
  console.log("At lap saving...");
  try {
    const { email, laps } = req.body;

    if (!email || !laps || !Array.isArray(laps) || laps.length === 0) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    const savedLaps = await Lap.insertMany(
      laps.map((time, index) => ({
        email,
        lap: index + 1,
        time,
      }))
    );

    res.status(201).json({ message: "Laps saved successfully!", savedLaps });
  } catch (error) {
    console.error("Error saving laps:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getLaps = async (req, res) => {
  console.log("At getting laps...");
  try {
    const { email } = req.body;

    let getLaps;

    if (email) {
      getLaps = await Lap.find({ email }).sort({ entryDate: -1 });
    } else {
      getLaps = await Lap.find().sort({ entryDate: -1 });
    }

    res.status(201).json({ message: "Laps retrieved successfully!", getLaps });
  } catch (error) {
    console.error("Error getting laps:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
