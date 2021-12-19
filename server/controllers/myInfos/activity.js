const { Users } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const { decrypt, encrypt } = require('../users/crypto');

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req.cookies);

  if (accessTokenData === null) {
    res.status(401).send({ data: null, message: 'not authorized' });
  }
};
