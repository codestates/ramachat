const { Notifications, Comments } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const sequelize = require('../../models').sequelize;

module.exports = (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);

  if (accessTokenData === null) {
    res.status(401).send({ data: null, message: 'not authorized' });
  }

  const id = accessTokenData.id;

  const sql = `Select n.id, n.userId, n.commentId, c.content, n.isChecked as isChecked from Comments c join ( Select noti.id , noti.userId , noti.commentId ,noti.isChecked, com.parentCommentId From Notifications as noti  Join Comments as com on noti.commentId = com.id where com.userId!=${id}) as n On n.parentCommentId = c.id where c.userId = ${id}`;
  sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then((data) => {
    return res.status(200).json({ data: data });
  });
};
// Comments.findAll({
//   where: { userId: id },
// }).then((data) => {
//   if (!data) {
//     return res.status(401).send('invalid user');
//   }
//   const id = data.id;
//   Notifications.findAll({
//     where: { commentId: id },
//   }).then((result) => {
//
//   });
// });

// const result = data.map((ele) => {
//     const dataResult = {
//       id: ele.id,
//       userId: ele.userId,
//       commentId: ele.commentId,
//       content: ele.content,
//       parentCommentId: ele.parentCommentId,
//     };
//     return dataResult;
//   });
//
// });
