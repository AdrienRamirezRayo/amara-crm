const express = require("express");
const router = express.Router();
const { getCarriers } = require("../controllers/carriers.controller");

router.get("/", getCarriers);

module.exports = router;