const sequelize = require('../../models').sequelize;
const { Comments } = require('../../models');
const { isAuthorized, checkAuthorization } = require('../tokenFunctions');

module.exports = async (req, res) => {
  // 요청 헤더에 authorization이 없을 경우
  let authorization = '';
  if (checkAuthorization(req)) {
    authorization = req.headers.authorization;
  }
  const accessTokenData = isAuthorized(authorization);

  let parentCommentId = -1;
  try {
    parentCommentId = req.query['parent-comment-id'];
  } catch {
    res.status(400).send('content to modify is not included in request body');
  }

  try {
    // 답글 정보 검색
    const searchedReplies = await Comments.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*)
                        FROM Likes
                        WHERE
                        Comments.id = Likes.targetId)`
            ),
            'likeNum',
          ],
        ],
      },
      where: { parentCommentId },
      order: [['createdAt', 'DESC']],
    });

    let userId = accessTokenData === null ? -1 : accessTokenData.id;
    let likedReplies = await sequelize
      .query(
        `SELECT c.id FROM Comments AS c JOIN Users AS u ON c.userId = u.id JOIN Likes AS l ON c.id = l.targetId WHERE c.parentCommentId = ${parentCommentId} and l.userId = ${userId}`
      )
      .then((result) => {
        return result[0].map((el) => el.id);
      });

    let replyResponse = searchedReplies.map((el) => {
      let reply = el.dataValues;
      reply.liked = likedReplies.includes(reply.id);
      return reply;
    });

    res.status(200).json({ comments: replyResponse });
  } catch (err) {
    {
      res.status(500).send('err');
    }
  }
};
