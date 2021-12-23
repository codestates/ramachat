const { Comments } = require('../../models');
const { EpisodeInfos } = require('../../models');
const { Notifications } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req.headers.authorization);
  // 인증 실패
  if (accessTokenData === null) {
    res.status(401).send('unauthorized user');
    return;
  }

  let commentId = '';
  try {
    commentId = req.params.commentId;
    // request의 paramter가 전달이 안됐을 때 => commentId가 없음
  } catch {
    res.status(400).send('Please provide all necessary information');
  }

  // 인증 성공
  // 삭제할 댓글의 에피소드 아이디 조회
  const commentToDelete = await Comments.findOne({ where: { id: commentId } })
    .then((result) => {
      // 삭제할 댓글이 없는 경우
      if (result === null) {
        res.status(404).send('nothing to delete');
      }
      return result;
    })
    .catch((err) => {
      res.status(500).send('err');
    });

  if (!commentToDelete) {
    return;
  }

  const { userId, episodeId } = commentToDelete.dataValues;

  // 댓글 삭제
  await Comments.destroy({ where: { id: commentId } }).catch((err) => {
    res.status(500).send('err');
  });

  // 에피소드에 해당하는 댓글이 없으면 해당 에피소드 정보 삭제
  try {
    let restCnt = await Comments.count({ where: { episodeId } });
    if (restCnt === 0) {
      await EpisodeInfos.destroy({ where: { id: episodeId } });
    }
  } catch {
    res.status(500).send('err');
  }

  // 해당 댓글의 알림 정보 삭제
  await Notifications.destroy({ where: { userId, commentId } }).catch((err) => {
    res.status(500).send('err');
  });
  res.status(200).send('comment delete success');
};
