const express = require("express");
const router = express.Router();
const { reverseGeocode } = require("../controller/locationController");

router.post("/reverse-geocode", reverseGeocode);

module.exports = router;
