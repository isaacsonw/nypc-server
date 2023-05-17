const express = require("express");
const authRouter = require("./routers/user");
const localityRouter = require("./routers/locality");
const connectDB = require("./db");
require("dotenv").config({ path: "./.env" });

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

app.use(express.json());

connectDB(uri).catch((err) => console.log(err));

app.use("/api/v1", authRouter);
app.use("/api/v1", localityRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
