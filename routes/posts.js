// routes/posts.js
const express = require('express');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  }
});

const upload = multer({ storage });

// Create a new post with an image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : null // Save image path if uploaded
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date_posted: -1, timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image, // Update image if a new one is uploaded
    };
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post by ID
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
