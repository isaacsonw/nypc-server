const express = require("express");
const router = express.Router();

const { login, create, getUser } = require("../controllers/user");

router.post("/login", login);
router.post("/create", create);
router.get("/user", getUser);

module.exports = router;
