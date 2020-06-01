const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const user = require('../../models/User');

// @ route    api/auth
// @ desc     get user
// @access    public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).send('server error');
  }
});

// @ route    POST api/auth
// @ desc     authorized user & return token
// @access    public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password between 6 to 8 chars').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [{ msg: 'Invalid credentials' }],
        });
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password);

      if (!doesPasswordMatch)
        return res.status(400).json({
          success: false,
          errors: [{ msg: 'Invalid credentials' }],
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ success: true, data: token });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
