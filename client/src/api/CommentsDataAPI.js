import axios from 'axios';

axios.defaults.withCredentials = true;

export function getEpisodeInfos(dramaId, seasonNumber) {
  console.log('api call made');
  return axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/episode-infos?drama-id=${dramaId}&season-index=${seasonNumber}`
    )
    .then((result) => {
      return result.data;
    });
}

export function getEpisodeComments(tokenState, episodeId) {
  console.log('getting comments', episodeId);
  return axios
    .get(`${process.env.REACT_APP_SERVER_URL}/comments?episode-id=${episodeId}`, {
      headers: {
        authorization: 'Bearer ' + tokenState,
      },
    })
    .then((result) => {
      console.log('코멘트 데이터', result.data.comments);
      return result.data.comments;
    });
}

export function postComment(
  tokenState,
  userId,
  content,
  dramaId,
  dramaName,
  seasonIndex,
  episodeIndex,
  episodeId,
  // commentNum,
  parentCommentId
) {
  console.log('sending new comment');
  console.log(
    tokenState,
    userId,
    content,
    dramaId,
    dramaName,
    seasonIndex,
    episodeIndex,
    episodeId,
    // commentNum,
    parentCommentId
  );
  return axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/comments/add`,
      {
        userId: userId,
        content: content,
        dramaId: dramaId,
        dramaName: dramaName,
        seasonIndex: seasonIndex,
        episodeIndex: episodeIndex,
        episodeId: episodeId,
        // commentNum: commentNum,
        parentCommentId: parentCommentId,
      },
      {
        headers: {
          'Content-Type': `application/json`,
          authorization: 'Bearer ' + tokenState,
        },
      }
    )
    .then((result) => {
      console.log(result);
      return result;
    });
}

export function deleteComment(tokenState, commentId) {
  return axios
    .delete(`${process.env.REACT_APP_SERVER_URL}/comments/${commentId}`, {
      headers: {
        authorization: 'Bearer ' + tokenState,
      },
    })
    .then((result) => {
      console.log(result);
      return result;
    });
}

export function getReplies(tokenState, parentCommentId) {
  return axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/replies?parent-comment-id=${parentCommentId}`,
      {
        headers: {
          authorization: 'Bearer ' + tokenState,
        },
      }
    )
    .then((result) => {
      // console.log('응답 코멘트: ', result.data.comments);
      return result.data.comments;
    });
}

export function modifyComment(tokenState, commentId, newContent) {
  return axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/comments/${commentId}`,
      {
        newContent: newContent,
      },
      {
        headers: {
          'Content-Type': `application/json`,
          authorization: 'Bearer ' + tokenState,
        },
      }
    )
    .then((result) => {
      console.log(result);
    });
}

export function likeComment(tokenState, commentId) {
  return axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/comments/likes/${commentId}`,
      {},
      {
        headers: {
          authorization: 'Bearer ' + tokenState,
        },
      }
    )
    .then((result) => {
      console.log('liked 응답 : ', result);
      return result.data.liked;
    });
}
