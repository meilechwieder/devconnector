const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @ route    POST api/posts
// @ desc     create a post
// @access    public
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      res.status(400).json({ succuss: false, errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      const post = await new Post(newPost).save();

      res.json({ succuss: true, data: post });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);

// @ route    GET api/posts
// @ desc     get all posts
// @access    private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json({ succuss: true, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    GET api/posts/:post_id
// @ desc     get post by id
// @access    private
router.get('/:post_id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.post_id))
    return res.status(400).json({
      success: false,
      errors: [{ msg: 'post not found' }],
    });
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post)
      return res
        .status(404)
        .json({ succuss: false, errors: [{ msg: 'post not found' }] });

    res.json({ succuss: true, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    DELETE api/posts/:post_id
// @ desc     delete id
// @access    private
router.delete('/:post_id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.post_id))
    return res.status(400).json({
      success: false,
      errors: [{ msg: 'post not found' }],
    });
  try {
    const post = await Post.findById(req.params.post_id);

    if (post.user.toString() !== req.user.id)
      return res
        .status(401)
        .json({ succuss: false, errors: [{ msg: 'user unauthorized' }] });

    await post.remove();

    res.json({ succuss: true, data: { msg: 'post deleted' } });
    res.json({ succuss: true, data: posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    PUT api/posts/like/:post_id
// @ desc     like a post
// @access    private
router.put('/likes/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    const likes = post.likes.map((e) => e.user.toString());

    if (likes.includes(req.user.id))
      return res
        .status(400)
        .json({ succuss: false, errors: [{ msg: 'post already liked' }] });

    post.likes.unshift(req.user.id);

    await post.save();

    res.json({ succuss: true, data: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});
module.exports = router;
