const express = require("express");
const router = express.Router();

const { add, getLocality, getLocalities } = require("../controllers/locality");

router.post("/locality/add", add);
router.get("/locality/get", getLocalities);
router.get("/locality/get/:id", getLocality);

module.exports = router;
