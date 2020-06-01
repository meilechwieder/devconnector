const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @ route    GET api/profile/me
// @ desc     get current users profile
// @access    Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res
        .status(400)
        .json({ success: false, errors: [{ msg: 'no profile' }] });

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    POST api/profile/me
// @ desc     create or update user profile
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
      } = req.body;

      // build profile object

      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills)
        profileFields.skills = Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => skill.trim());

      //build social object
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (facebook) profileFields.social.facebook = facebook;

      let profile = await Profile.findOne({ user: req.user.id });

      //if already there, update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      } else {
        profile = new Profile(profileFields);

        await profile.save();
      }

      res.json({ success: true, data: profile });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);

// @ route    GET api/profile/me
// @ desc     get all profiles
// @access    Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json({ success: true, data: profiles });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    GET api/profile/user/:user_id
// @ desc     get all profiles
// @access    Public
router.get('/user/:user_id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.user_id))
    return res.status(400).json({
      success: false,
      errors: [{ msg: 'Invalid id' }],
    });
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Profile not found' }],
      });
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    DELETE api/profile
// @ desc     delete profile user and posts
// @access    Private
router.delete('/', auth, async (req, res) => {
  try {
    //remove user posts
    await Post.deleteMany({ user: req.user.id });

    await Profile.findOneAndRemove({
      user: req.user.id,
    });
    await User.findOneAndRemove({
      _id: req.user.id,
    });

    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });
    if (user || profile)
      return res
        .status(400)
        .json({ status: 'error', msg: 'user not delete..' });
    res.json({ success: true, msg: 'user deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    PUT api/profile/experience
// @ desc     add experience to profile
// @access    Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from: new Date(from),
      to: to ? new Date(to) : '',
      current: isNaN(this.to) ? current : false,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile)
        return res.status(400).json({
          success: false,
          errors: [{ msg: 'User does not have a profile yet' }],
        });
      if (
        isNaN(newExp.from) ||
        (newExp.to && isNaN(newExp.to)) ||
        (newExp.to && newExp.from > newExp.to)
      )
        return res.status(400).json({
          success: false,
          errors: [{ msg: 'Date is invalid' }],
        });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json({ success: true, data: profile });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);

// @ route    DELETe api/profile/experience/:exp_id
// @ desc     delete experience from profile\
// @access    Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience.findIndex(
      (e) => e._id.toString() === req.params.exp_id
    );

    console.log(typeof req.params.exp_id);
    if (removeIndex === -1)
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Experience ID not found' }],
      });

    profile.experience.splice(removeIndex, 1);
    console.log(removeIndex);
    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    DELETe api/profile/education/:edu_id
// @ desc     delete education from profile\
// @access    Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education.findIndex(
      (e) => e._id.toString() === req.params.edu_id
    );
    if (removeIndex === -1)
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Education ID not found' }],
      });

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    PUT api/profile/education
// @ desc     add education to profile
// @access    Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from: new Date(from),
      to: to ? new Date(to) : '',
      current: isNaN(this.to) ? current : false,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile)
        return res.status(400).json({
          success: false,
          errors: [{ msg: 'User does not have a profile yet' }],
        });

      if (
        isNaN(newEdu.from) ||
        (newEdu.to && isNaN(newEdu.to)) ||
        (newEdu.to && newEdu.from > newEdu.to)
      )
        return res.status(400).json({
          success: false,
          errors: [{ msg: 'Date is invalid' }],
        });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json({ success: true, data: profile });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);

// @ route    GET api/profile/github/:username
// @ desc     get github user repos
// @access    Private
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'User-Agent': 'node.js' },
    };

    request(options, (err, response, body) => {
      if (err) console.error(err);

      if (response.statusCode !== 200) {
        return res.status(404).json({
          success: false,
          errors: [{ msg: 'No github profile found', hello: response }],
        });
      } else {
        res.json({ success: true, data: JSON.parse(body) });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});
module.exports = router;
