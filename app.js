require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const secretKey = crypto.randomBytes(20).toString("hex");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;

app.use(express.json());

const user = {
  username: "user",
  password: "1234",
};

app.post("/authenticate", async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.status(300).json({ message: "No info" });
  if (
    req.body.username == user.username &&
    req.body.password == user.password
  ) {
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "30m" });
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 20,
    });
    return res.status(200).json({ message: "Successfully logged in" });
  } else {
    res.status(300).json({ message: "Forbidden access" });
  }
});

async function authenticateToken() {
  res.status(300).json({ message: "WARNING: NOT AUTHENTICATED" });
}

const blogRouter = require("./routes/blog");

app.use("/blog", blogRouter);

app.listen(2999, () => console.log("Server started"));
