const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  uri: {
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
