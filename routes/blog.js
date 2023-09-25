const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secretKey = require("../vars");

router.use(
  cors({
    origin: "https://elynch.co",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

//Check for JWT token to be able to modify any blogs. Might not be necessary having a firewall, but just in case
async function authenticateToken(req, res, next) {
  const token = req?.cookies?.accessToken.toString();

  if (!token) {
    return res.status(401).json({ message: "Access forbidden: Unauthorized" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Access forbidden: Unauthorized jwt" });
    }
    req.user = decoded;

    next();
  });
}

//GET all
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//GET one
router.get("/:id", getBlog, (req, res) => {
  res.status(200).json(res.blog);
});

//Authenticate the routes below

//CREATE
router.post("/", authenticateToken, async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
    });
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//UPDATE one
router.patch("/:id", authenticateToken, getBlog, async (req, res) => {
  if (req.body.title) {
    res.blog.title = req.body.title;
  }
  if (req.body.description) {
    res.blog.description = req.body.description;
  }
  try {
    const updatedBlog = await res.blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//DELETE one
router.delete("/:id", authenticateToken, getBlog, async (req, res) => {
  try {
    await res.blog.remove();
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.blog = blog;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
module.exports = router;
