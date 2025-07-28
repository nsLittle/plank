import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: {
    email: string;
  };
}

interface TotalsEntry {
  plankType: string;
  totalTime: number;
  reps: number;
}

interface LapEntry {
  time: number;
  plankType: string;
  entryDate: Date;
}

const Lap = require("../models/Lap").default;

function getDateRange(mode: "daily" | "monthly" | "yearly") {
  const now = new Date();
  let start, end;

  switch (mode) {
    case "daily":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;

    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;

    default:
      throw new Error("Invalid mode");
  }

  return { start, end };
}

const aggregateTotalsByType = async (
  email: string,
  range?: { start: Date; end: Date }
) => {
  const match: Record<string, any> = { email };

  if (range) {
    match.entryDate = { $gte: range.start, $lte: range.end };
  }

  const totals = await Lap.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$plankType",
        totalTime: { $sum: "$time" },
        reps: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        plankType: "$_id",
        totalTime: 1,
        reps: 1,
      },
    },
  ]);

  const result: Record<string, { total: number; reps: number }> = {};
  totals.forEach((entry: TotalsEntry) => {
    const { plankType, totalTime, reps } = entry;
    result[plankType] = { total: totalTime, reps };
  });

  return result;
};

// POST /saveLaps
const saveLaps = async (req: AuthenticatedRequest, res: Response) => {
  console.log("At lap saving...");
  console.log("Body:", req.body);
  console.log("User:", req.user);
  try {
    const { laps, plankType } = req.body;
    const email = (req as AuthenticatedRequest).user.email;

    const validPlankTypes = [
      "basic plank",
      "elbow plank",
      "left leg raise plank",
      "right leg raise plank",
      "left side plank",
      "right side plank",
    ];

    if (
      !laps ||
      !plankType ||
      !Array.isArray(laps) ||
      laps.length === 0 ||
      !validPlankTypes.includes(plankType)
    ) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const todayLapCount = await Lap.countDocuments({
      email,
      entryDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const savedLaps = await Lap.insertMany(
      laps.map((time, index) => ({
        email,
        lap: index + 1,
        plankType,
        time,
      }))
    );

    res.status(201).json({ message: "Laps saved successfully!", savedLaps });
  } catch (error) {
    console.error("Error saving laps:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /getAllLaps
const getAllLaps = async (req: AuthenticatedRequest, res: Response) => {
  console.log("At getting laps...");
  try {
    const email = (req as AuthenticatedRequest).user.email;

    const getAllLaps = await Lap.find({ email }).sort({ entryDate: -1 });

    res
      .status(201)
      .json({ message: "Laps retrieved successfully!", getAllLaps });
  } catch (error) {
    console.error("Error getting laps:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /getTodaysProgress
const getTodaysProgress = async (req: AuthenticatedRequest, res: Response) => {
  console.log("At getting today’s progress...");
  try {
    const email = (req as AuthenticatedRequest).user.email;

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const laps = await Lap.find({
      email,
      entryDate: { $gte: startOfDay, $lte: endOfDay },
    });

    let totalReps = 0;
    let totalTime = 0;
    let longestPlank = 0;
    let byType: Record<string, { total: number; reps: number }> = {};

    for (const lap of laps as LapEntry[]) {
      totalReps += 1;
      totalTime += lap.time;
      if (lap.time > longestPlank) longestPlank = lap.time;

      if (!byType[lap.plankType]) {
        byType[lap.plankType] = { total: 0, reps: 0 };
      }

      byType[lap.plankType].total += lap.time;
      byType[lap.plankType].reps += 1;
    }

    res.status(200).json({
      date: startOfDay.toISOString().split("T")[0],
      totalReps,
      totalTime,
      longestPlank,
      byType,
    });
  } catch (error) {
    console.error("Error getting today's progress:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /getTodaysTotalsByType
const getTodaysTotalsByType = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const range = getDateRange("daily");
    const byType = await aggregateTotalsByType(email, range);

    let totalReps = 0;
    let totalTime = 0;
    for (const type of Object.values(byType)) {
      totalReps += type.reps;
      totalTime += type.total;
    }

    res.status(200).json({
      date: range.start.toISOString().split("T")[0],
      totalReps,
      totalTime,
      longestPlank: 0, // Optional: Implement longest plank calc per range if needed
      byType,
    });
  } catch (error) {
    console.error("Daily total error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /getTodaysSessions
const getTodaysSessions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.user.email;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await Lap.find({
      email,
      entryDate: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ entryDate: 1 });

    const formatted = sessions.map((lap: LapEntry) => ({
      type: lap.plankType,
      duration: lap.time,
      timestamp: lap.entryDate,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching today's sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /getMonthlyProgress
const getMonthlyProgress = async (req: Request, res: Response) => {
  console.log("At getting monthly progress...");
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const range = getDateRange("monthly");

    const laps = await Lap.find({
      email,
      entryDate: { $gte: range.start, $lte: range.end },
    });

    let totalReps = 0;
    let totalTime = 0;
    let longestPlank = 0;
    let byType: Record<string, { total: number; reps: number }> = {};

    for (const lap of laps as LapEntry[]) {
      totalReps += 1;
      totalTime += lap.time;
      if (lap.time > longestPlank) longestPlank = lap.time;

      if (!byType[lap.plankType]) {
        byType[lap.plankType] = { total: 0, reps: 0 };
      }

      byType[lap.plankType].total += lap.time;
      byType[lap.plankType].reps += 1;
    }

    res.status(200).json({
      date: range.start.toISOString().split("T")[0],
      totalReps,
      totalTime,
      longestPlank,
      byType,
    });
  } catch (error) {
    console.error("Monthly progress error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /getMonthlyTotalsByType
const getMonthlyTotalsByType = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const range = getDateRange("monthly");
    const byType = await aggregateTotalsByType(email, range);

    let totalReps = 0;
    let totalTime = 0;
    for (const type of Object.values(byType)) {
      totalReps += type.reps;
      totalTime += type.total;
    }

    res.status(200).json({
      date: range.start.toISOString().split("T")[0],
      totalReps,
      totalTime,
      longestPlank: 0, // Optional: Implement longest plank calc per range if needed
      byType,
    });
  } catch (error) {
    console.error("Daily total error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /getYearlyProgress
const getYearlyProgress = async (req: AuthenticatedRequest, res: Response) => {
  console.log("At getting yearly progress...");
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const range = getDateRange("yearly");

    const laps = await Lap.find({
      email,
      entryDate: { $gte: range.start, $lte: range.end },
    });

    let totalReps = 0;
    let totalTime = 0;
    let longestPlank = 0;
    let byType: Record<string, { total: number; reps: number }> = {};

    for (const lap of laps as LapEntry[]) {
      totalReps += 1;
      totalTime += lap.time;
      if (lap.time > longestPlank) longestPlank = lap.time;

      if (!byType[lap.plankType]) {
        byType[lap.plankType] = { total: 0, reps: 0 };
      }

      byType[lap.plankType].total += lap.time;
      byType[lap.plankType].reps += 1;
    }

    res.status(200).json({
      date: range.start.toISOString().split("T")[0],
      totalReps,
      totalTime,
      longestPlank,
      byType,
    });
  } catch (error) {
    console.error("Yearly progress error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /getYearlyTotalsByType
const getYearlyTotalsByType = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const range = getDateRange("yearly");
    const byType = await aggregateTotalsByType(email, range);

    let totalReps = 0;
    let totalTime = 0;
    for (const type of Object.values(byType)) {
      totalReps += type.reps;
      totalTime += type.total;
    }

    res.status(200).json({
      date: range.start.toISOString().split("T")[0],
      totalReps,
      totalTime,
      longestPlank: 0, // Optional: Implement longest plank calc per range if needed
      byType,
    });
  } catch (error) {
    console.error("Yearly total error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /getAllProgress
const getAllProgress = async (req: AuthenticatedRequest, res: Response) => {
  console.log("At getting all progress...");
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const laps = await Lap.find({ email });

    let totalReps = 0;
    let totalTime = 0;
    let longestPlank = 0;
    let byType: Record<string, { total: number; reps: number }> = {};

    for (const lap of laps as LapEntry[]) {
      totalReps += 1;
      totalTime += lap.time;
      if (lap.time > longestPlank) longestPlank = lap.time;

      if (!byType[lap.plankType]) {
        byType[lap.plankType] = { total: 0, reps: 0 };
      }

      byType[lap.plankType].total += lap.time;
      byType[lap.plankType].reps += 1;
    }

    res.status(200).json({
      date: null,
      totalReps,
      totalTime,
      longestPlank,
      byType,
    });
  } catch (error) {
    console.error("All progress error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /getAllTotalsByType
const getAllTotalsByType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = (req as AuthenticatedRequest).user.email;
    const byType = await aggregateTotalsByType(email);

    let totalReps = 0;
    let totalTime = 0;
    for (const type of Object.values(byType)) {
      totalReps += type.reps;
      totalTime += type.total;
    }

    res.status(200).json({
      date: null,
      totalReps,
      totalTime,
      longestPlank: 0, // Optional: fetch max if needed
      byType,
    });
  } catch (error) {
    console.error("All totals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /achievements
const getAchievements = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.user.email;

    // 1. First plank date
    const firstLap = await Lap.findOne({ email }).sort({ entryDate: 1 });

    // 2. Longest plank time
    const longestLap = await Lap.findOne({ email }).sort({ time: -1 });

    // If no laps exist
    if (!firstLap || !longestLap) {
      return res.status(200).json({
        firstPlankDate: null,
        longestPlankTime: 0,
        streaksCompleted: [],
        dailyTotalsMet: [],
        allTypesCompleted: [],
      });
    }

    res.status(200).json({
      firstPlankDate: firstLap.entryDate.toISOString().split("T")[0],
      longestPlankTime: longestLap.time,
      streaksCompleted: [],
      dailyTotalsMet: [],
      allTypesCompleted: [],
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
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
};
