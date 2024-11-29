// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date_posted: {
    type: Date,
    default: Date.now,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  image_url: {
    type: String,
    required: false, // Set to true if image URL is mandatory
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
