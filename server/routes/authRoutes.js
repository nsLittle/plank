const express = require("express");
const passport = require("passport");
const {
  accountCreation,
  login,
  logout,
  googleAuth,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// STANDARD
router.post("/signup", accountCreation);
router.post("/login", login);
router.get("/protected-route", protect, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GOOGLE OAUTH
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.user
      ? googleAuth(req, res)
      : res.status(401).json({ error: "Auth failed" });
  }
);

module.exports = router;
