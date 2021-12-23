const { Users, Notifications } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);

  console.log(accessTokenData);
  if (accessTokenData === null) {
    res.status(401).send({ data: null, message: 'not authorized' });
  }

  const notiId = req.params.notiId;

  if (!notiId) {
    return res.status(500).send('err');
  }

  Notifications.update(
    {
      isChecked: 1,
    },
    { where: { id: notiId } }
  );
  return res.status(200).send('isChecked changed');
};

//업데이트
