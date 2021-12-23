const { Users } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const { decrypt, encrypt } = require('../users/crypto');

module.exports = (req, res) => {
  console.log('body', req.body);
  const accessTokenData = isAuthorized(req.headers.authorization);

  if (accessTokenData === null) {
    res.status(401).send({ data: null, message: 'not authorized' });
  }
  const { userId } = accessTokenData;
  const { password } = req.body;
  const { newPassword } = req.body;

  const dbpw = encrypt(password);
  const dbnpw = encrypt(newPassword);

  Users.findOne({
    where: {
      userId,
    },
  })
    .then((data) => {
      if (data.password !== dbpw) {
        const dbpw1 = decrypt(data.password);
        console.log(dbpw1);
        return res.status(400).send('BadParameterException');
      }
      if (data.password === dbnpw) {
        return res.status(422).send('same as previous password');
      } else {
        Users.update(
          {
            password: dbnpw,
          },
          {
            where: {
              userId,
            },
          }
        );
        return res.status(201).send('password changed');
      }
    })
    .catch((err) => {
      return res.status(500).send('err');
    });
};
