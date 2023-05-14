const express = require("express");
const authRouter = require("./routers/user");
const connectDB = require("./db");
require("dotenv").config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB().catch((err) => console.log(err));

app.use("/api/v1", authRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
