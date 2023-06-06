const express = require("express");
const router = express.Router();

const { login, create, getUser } = require("../controllers/user");
const {
  addYoungPerson,
  getYoungpeople
} = require("../controllers/youngPeople");

router.post("/login", login);
router.post("/create", create);
router.get("/profile", getUser);
router.post("/user/young-person", addYoungPerson);
router.get("/user/young-person", getYoungpeople);

module.exports = router;
