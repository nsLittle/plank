const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  console.log("At signup!");
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log("Hashed Password: ", hashedPassword);
    console.log("Entered Password: ", req.body.password);

    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, password: user.password },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Token: ", token);
    console.log("UserId: ", user._id);
    console.log("Email: ", user.email);
    console.log("Password: ", user.password);

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Email: ", email);
    console.log("Password: ", password);

    const user = await User.findOne({ email });
    console.log("User found:", email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    console.log("Email: ", user.email);
    console.log("Saved Password: ", user.password);
    console.log("Entered Password: ", password);

    console.log("Comparing passwords...");
    if (user.password === password) {
      console.log("It is a match");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token: ", token);

    res.status(200).json({
      message: "Login successful",
      token,
      email: user.email,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  res
    .status(200)
    .json({ message: "Logged out successfully. Remove token on client-side." });
};
