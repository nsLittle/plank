const express = require("express");
const router = express.Router();
const {
  saveLaps,
  getAllLaps,
  getTodaysProgress,
  getTodaysTotalsByType,
  getTodaysSessions,
  getMonthlyProgress,
  getMonthlyTotalsByType,
  getYearlyProgress,
  getYearlyTotalsByType,
  getAllProgress,
  getAllTotalsByType,
  getAchievements,
} = require("../controllers/lapController");
const { protect } = require("../middleware/authMiddleware");

router.post("/saveLaps", protect, saveLaps);
router.get("/getAllLaps", protect, getAllLaps);
router.get("/getTodaysProgress", protect, getTodaysProgress);
router.get("/getTodaysTotalsByType", protect, getTodaysTotalsByType);
router.get("/getTodaysSessions", protect, getTodaysSessions);
router.get("/getMonthlyProgress", protect, getMonthlyProgress);
router.get("/getMonthlyTotalsByType", protect, getMonthlyTotalsByType);
router.get("/getYearlyProgress", protect, getYearlyProgress);
router.get("/getYearlyTotalsByType", protect, getYearlyTotalsByType);
router.get("/getAllProgress", protect, getAllProgress);
router.get("/getAllTotalsByType", protect, getAllTotalsByType);
router.get("/getAchievements", protect, getAchievements);

module.exports = router;
