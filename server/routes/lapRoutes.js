const express = require("express");
const router = express.Router();
const { saveLaps, getLaps } = require("../controllers/lapController");

router.post("/saveLaps", saveLaps);

router.get("/getLaps", getLaps);

module.exports = router;
