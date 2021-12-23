const sequelize = require('../../models').sequelize;
const Op = require('sequelize').Op;
const { Comments } = require('../../models');
const { isAuthorized, checkAuthorization } = require('../tokenFunctions');

module.exports = async (req, res) => {
  // 요청 헤더에 authorization이 없을 경우
  let authorization = '';
  if (checkAuthorization(req)) {
    authorization = req.headers.authorization;
  }

  const accessTokenData = isAuthorized(authorization);

  let episodeId = -1;
  try {
    episodeId = req.query['episode-id'];
  } catch (err) {
    console.log('err');
    res.status(400).send('Please provide all necessary information');
  }

  // 댓글 정보 검색
  const searchedComments = await Comments.findAll({
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
    where: { episodeId, parentCommentId: null },
    order: [['createdAt', 'DESC']],
  }).catch((err) => {
    console.log(err);
    res.status(500).send('err');
  });

  let userId = accessTokenData === null ? -1 : accessTokenData.id;
  let likedComments = await sequelize
    .query(
      `SELECT c.id FROM Comments AS c JOIN Likes AS l ON c.id = l.targetId WHERE c.episodeId = ${episodeId} and l.userId = ${userId}`,
      { type: sequelize.QueryTypes.SELECT }
    )
    .then((result) => {
      return result.map((el) => {
        return el.id;
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('err');
    });

  // 답글 개수 조회
  const replyNums = await Comments.findAll({
    attributes: [
      'parentCommentId',
      [sequelize.fn('COUNT', 'parentCommentId'), 'replyNum'],
    ],
    where: { parentCommentId: { [Op.ne]: null }, episodeId },
    group: ['parentCommentId'],
  })
    .then((result) => {
      //console.log(result);
      if (result.length === 0) return {};
      else {
        let cnt = {};
        result.forEach((data) => {
          const { parentCommentId, replyNum } = data.dataValues;
          cnt[parentCommentId] = replyNum;
        });
        return cnt;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  try {
    // 응답 객체 세팅 => 댓글 정보
    let commentArr = searchedComments.map((comment) => {
      let commentResponse = ({
        id,
        episodeId,
        userId,
        content,
        parentCommentId,
        likeNum,
        createdAt,
        updatedAt,
      } = comment.dataValues);
      commentResponse.replyNum = replyNums[id] === undefined ? 0 : replyNums[id];
      commentResponse.liked =
        likedComments === (undefined || null) ? 0 : likedComments.includes(id);
      return commentResponse;
    });
    res.status(200).json({ comments: commentArr });
  } catch (err) {
    console.log(err);
    res.status(500).send('err');
  }
};
