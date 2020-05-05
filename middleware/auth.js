const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // get token from header
  const token = req.header('token');
  if (!token)
    return res
      .status(401)
      .json({
        success: false,
        errors: [{ msg: 'no token, access denied', field: 'token header' }],
      });

  //verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        errors: [
          { msg: 'token is invalid, access denied', field: 'token header' },
        ],
      });
  }
};
