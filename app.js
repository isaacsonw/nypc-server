const express = require("express");
const authRouter = require("./routers/user");
require("dotenv").config();

const app = express();
const port = 4200;

app.use(express.json());

app.use("/api/v1", authRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
