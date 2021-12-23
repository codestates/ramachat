const { Users, Comments } = require('../../models');
const { encrypt, decrypt } = require('./crypto');
const { isAuthorized } = require('../tokenFunctions');

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);

  const id = accessTokenData.id;

  if (accessTokenData === null) {
    res.status(401).send({ data: null, message: 'not authorized' });
  }

  Users.findOne({
    where: { id },
  }).then((data) => {
    Comments.destroy({
      where: {
        userId: data.id,
      },
    });
    Users.destroy({
      where: { id: data.id },
    });
  });

  return res.status(200).send('successfully signed out');
};
