require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

module.exports = {
  checkAuthorization: (req) => {
    if (!req.headers.hasOwnProperty('authorization')) {
      console.log('hasownproperty');
      return false;
    }
    if (!req.headers.authorization) {
      console.log('null or undefined');
      return false;
    }
    if (req.headers.authorization.includes('null')) {
      console.log('include null');
      return false;
    }
    return true;
  },
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: '6h' });
  },
  sendAccessToken: (res, accessToken) => {
    return res.status(200).cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  },
  isAuthorized: (req) => {
    const authorization = req;
    if (!authorization) {
      return null;
    }
    const token = authorization.split(' ')[1];
    try {
      return verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
