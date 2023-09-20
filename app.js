require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

app.use(express.json());

const blogRouter = require("./routes/blog");

app.use("/blog", blogRouter);

app.listen(3000, () => console.log("Server started"));
