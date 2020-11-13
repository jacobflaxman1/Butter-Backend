const router = require('express').Router();
const Post = require('../Models/Post');

router.get('/post/:id', async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  console.log(post);
  if (!post) return res.json({ error: 'Could not find the post' });
  res.json(post);
});

router.get('/post', async (req, res) => {
  const posts = await Post.find();
  // if (!post) return res.json({ error: 'Could not find the post' });
  res.json(posts);
});

router.post('/post', async (req, res) => {
  const postToSave = new Post({
    title: req.body.title,
    body: req.body.body,
    user: req.body.user,
  });

  try {
    let id = '';
    await postToSave.save(function (err, post) {
      id = post._id;
      res.json({ message: 'Post saved to database', id });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
