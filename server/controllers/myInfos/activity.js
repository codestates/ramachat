const { isAuthorized } = require('../tokenFunctions');
const sequelize = require('../../models').sequelize;
const { Comments, Likes, EpisodeInfos } = require('../../models');
const Op = require('sequelize').Op;

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);

  if (accessTokenData === null) {
    res.status(401).send({ data: null, message: 'not authorized' });
  }

  const id = accessTokenData.id;

  //EpisodeInfos 찾기
  // const sqlReplyNum = `select count(*) as replyNum from Comments as c join Users as u on u.id = c.userId where c.userId = ${id} && parentCommentId IS NOT NULL`;
  // const sqlLikeNum = `select count(*) as likeNum from Comments as c join Likes as l on c.id = l.targetId`;
  const sql = `select DISTINCT c.id,c.content,c.parentCommentId, e.dramaId, e.seasonIndex, e.episodeIndex ,c.createdAt from EpisodeInfos as e join Comments as c on e.id=c.episodeId join Users as u on u.id = c.userId where u.id = ${id};`;
  const epiData = await sequelize
    .query(sql, { type: sequelize.QueryTypes.SELECT })
    .then((data) => {
      return data;
    })
    .catch((err) => {});
  // const likeNum = await sequelize
  //   .query(sqlLikeNum, { type: sequelize.QueryTypes.SELECT })
  //   .then((data) => {
  //     return data;
  //   })
  //   .catch((err) => {
  //
  //   });
  // const replyNum = await sequelize
  //   .query(sqlReplyNum, { type: sequelize.QueryTypes.SELECT })
  //   .then((data) => {
  //     return data;
  //   })
  //   .catch((err) => {
  //
  //   });

  const result = epiData.map((ele) => {
    const result2 = ({ content, parentCommentId, dramaId, seasonIndex, episodeIndex } =
      ele);
    // result2.likeNum = likeNum[0].likeNum;
    // result2.replyNum = replyNum[0].replyNum;
    return result2;
  });
  return res.status(200).json({ data: result });
};

//=====================================================================================================================
// likeNum 찾기
//   const likeNum = await Comments.findAll({
//     attributes: {
//       include: [
//         [
//           sequelize.literal(
//             `(SELECT COUNT(*)
//             FROM Likes
//             WHERE
//             Likes.targetId = Comments.id)`
//           ),
//           'likesNum',
//         ],
//       ],
//     },
//     where: { userId: id },
//   })
//     .then((data) => {
//       return data;
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });

//   //replyNum 찾기
//   const arr = 0;
//   const replyNums = await Comments.findAll({
//     attributes: [
//       'parentCommentId',
//       [sequelize.fn('COUNT', 'parentCommentId'), 'replyNum'],
//     ],
//     where: { parentCommentId: { [Op.ne]: null }, userId: id },
//   })
//     .then((data) => {
//
//       let i = data.map((ele) => {
//         return ele.dataValues.replyNum;
//       });
//       return i;
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });

//
//   let result = likeNum.map((ele) => {
//     let result2 = ({
//       episodeId,
//       userId,
//       content,
//       parentCommentId,
//       likesNum,
//       createdAt,
//       updatedAt,
//     } = ele.dataValues);
//     result2.replyNum = replyNums.map((ele) => {
//       return ele;
//     });
//     return result2;
//   });
//
// };

// const replyNums = await Comments.findAll({
//   attributes: ['parentCommentId', [sequelize.fn('COUNT', 'parentCommentId'), 'replyNum']],
//   where: { parentCommentId: { [Op.ne]: null } },
//   group: ['parentCommentId'],
// });
// const replyNum = await Comments.findAll({
//   attributes: ['parentCommentId'],
//   include: [
//     [
//       sequelize.literal(
//         `(SELECT COUNT(*)
//                   FROM Likes
//                   WHERE
//                   Comments.id = Comments.parentCommentId)`
//       ),
//       'likeNum',
//     ],
//   ],
//   where: { userId: id },
// });

//

//EpisodeInfos
//Reply

// const sql = `select u.id,c.episodeId,c.content,c.parentCommentId,e.dramaId,e.dramaName,e.seasonIndex,e.episodeIndex from Users as u join Comments as c on u.id = c.userId join EpisodeInfos as e on c.episodeId = e.id where u.id = ${id}`;

// const result = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });

// const likeNum = await result
//   .findAll({
//     attributes: {
//       include: [
//         [
//           sequelize.literal(
//             `(SELECT COUNT(*)
//               FROM Likes
//               WHERE
//               Likes.targetId = Comments.id)`
//           ),
//           'likesNum',
//         ],
//       ],
//     },
//   })
//     .then((data) => {
//
//     });
// };
