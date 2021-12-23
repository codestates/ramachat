const { Likes } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);
  // 인증 실패
  if (accessTokenData === null) {
    res.status(401).send('unauthorized user');
    return;
  }

  let userId = '',
    targetId = '';
  try {
    // 인증 성공
    // 좋아요 객체 세팅
    userId = accessTokenData.id;
    targetId = req.params.commentId;
  } catch (err) {
    res.status(400).send('lease provide all necessary information');
  }
  let newLike = { userId, targetId };

  // 좋아요 정보 삽입
  const [info, liked] = await Likes.findOrCreate({
    where: newLike,
    defaults: newLike,
  }).catch((err) => res.status(500).send('err'));

  if (!liked) {
    Likes.destroy({ where: { id: info.dataValues.id } }); // 좋아요가 있을 경우 취소
  }
  res.status(201).json({ liked });
};
