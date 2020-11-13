const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    max: 1024,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Post', postSchema);
