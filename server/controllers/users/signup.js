const { Users } = require('../../models');
const { encrypt, decrypt } = require('./crypto');

module.exports = async (req, res) => {
  const { userId, email, password } = req.body;

  if (!req.body.email || !req.body.password || !req.body.userId) {
    return res.status(422).send('insufficient parameters supplied');
  }

  const pw = encrypt(password);

  const userDb = await Users.findOne({
    where: {
      userId,
    },
  });
  if (userDb) {
    return res.status(409).json({ message: 'already existed userId' });
  }

  const emailDb = await Users.findOne({
    where: {
      email,
    },
  });
  if (emailDb) {
    return res.status(409).send({ message: 'already existed email' });
  }

  Users.create({
    userId: userId,
    password: pw,
    email: email,
  });
  return res.status(200).send('ok');
};
