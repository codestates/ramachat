const { Comments } = require('../../models');
const { EpisodeInfos } = require('../../models');
const { Notifications } = require('../../models');
const { isAuthorized, checkAuthorization } = require('../tokenFunctions');

module.exports = async (req, res) => {
  // 요청 헤더에 authorization이 없을 경우
  if (!checkAuthorization(req)) {
    res.status(401).send('unauthorized user');
    return;
  }

  const accessTokenData = isAuthorized(req.headers.authorization);
  // 인증 실패
  if (accessTokenData === null || !accessTokenData.hasOwnProperty('id')) {
    res.status(401).send('unauthorized user');
    return;
  }

  // 인증 성공
  const userId = accessTokenData.id;

  if (
    !req.body.hasOwnProperty(
      'content',
      'episodeId',
      'dramaId',
      'dramaName',
      'episodeIndex'
    )
  ) {
    res.status(400).send('Please provide all necessary information');
    return;
  }

  const {
    content,
    episodeId,
    dramaId,
    dramaName,
    seasonIndex,
    episodeIndex,
    parentCommentId,
  } = req.body; // body에서 필요한 값 받기 => 오류 발생 시 catch

  // 새 댓글 객체 세팅
  const newComment = {
    episodeId,
    userId,
    content,
    parentCommentId,
  };

  // EpisodeInfos 테이블에 해당 에피소드 아이디를 가진 값이 없을 때  => 첫 댓글
  const [info, created] = await EpisodeInfos.findOrCreate({
    where: { id: episodeId },
    defaults: {
      id: episodeId,
      dramaId,
      dramaName,
      seasonIndex,
      episodeIndex,
    },
  });

  // 에피소드 정보를 찾거나 만드는데 실패했을 경우
  if (!info) {
    res.status(500).send('err');
    return;
  }

  // 댓글을 Comments 테이블에 삽입
  const createdComment = await Comments.create(newComment)
    .then((result) => result)
    .catch((err) => {
      // 댓글 삽입에 실패할 때
      res.status(500).send('err');
    });

  let commentResponse = createdComment.dataValues;

  // 답글이 아닐 때
  if (!parentCommentId) {
    commentResponse.parentCommentId = null;
    res.status(201).json(commentResponse);
    return;
  }

  // 답글일 때
  // 알림 테이블에 추가
  await Notifications.create({ userId, commentId: commentResponse.id })
    .then((result) => {
      res.status(201).json(commentResponse);
    })
    .catch((err) => {
      // 오류 발생 시 추가한 테이블을 제거 시도
      // reauest body에서 필요한 값을 읽어오지 못할 때
      if (created) {
        EpisodeInfos.destory({
          where: { id: episodeId },
        });
        Comments.destroy({
          where: { id },
        });
        res.status(500).send('err');
      }
    });
};
