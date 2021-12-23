const { Comments } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);
  // 인증 실패
  if (accessTokenData === null) {
    res.status(401).send('unauthorized user');
    return;
  }

  // 인증 성공
  const { commentId } = req.params;
  let newContent = '';
  // request body에 newContent 값이 없는 경우
  if (!req.body.hasOwnProperty('newContent')) {
    res.status(400).send('content to modify is not included in request body');
    return;
  }
  newContent = req.body.newContent;

  // 댓글 정보 수정
  const updatedComment = await Comments.update(
    { content: newContent },
    { where: { id: commentId } }
  );

  // 수정할 댓글이 없는 경우
  if (updatedComment[0] === 0) {
    res.status(404).send('nothing to modify');
    return;
  }

  const searchedComment = await Comments.findOne({
    attributes: ['id', 'updatedAt'],
    where: { id: commentId },
  }).catch((err) => res.status(500).send('err'));

  res.status(201).json(searchedComment);
};
