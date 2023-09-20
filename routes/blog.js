const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const cors = require("cors");

router.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

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
  res.json(res.blog);
});

//CREATE
router.post("/", async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//UPDATE one
router.patch("/:id", getBlog, async (req, res) => {
  if (req.body.title != null) {
    res.blog.title = req.body.title;
  }
  if (req.body.description != null) {
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
router.delete("/:id", getBlog, async (req, res) => {
  try {
    await res.blog.remove();
    res.json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getBlog(req, res, next) {
  let blog;
  try {
    blog = await Blog.findById(req.params.id);
    if (blog == null) {
      return res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blog = blog;
  next();
}
module.exports = router;
