import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import IconButton from './IconButton';
import Modal from './Modal';
import Reply from './Reply';
import {
  deleteComment,
  getReplies,
  modifyComment,
  likeComment,
} from '../api/CommentsDataAPI';
import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import TextButton from './TextButton';

const CommentContainer = styled.article`
  width: 100%;
  padding: 1rem;
  border-top: 1px solid ${colors.primary};
  /* display: ${(props) => (props.hasDeleted ? 'none' : 'block')}; */

  textarea {
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
    gap: 0.5rem;
  }

  .icon-name {
    display: none;
    @media ${device.tablet} {
      display: inline;
    }
  }
`;

const CommentInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .created-date {
    color: ${colors.grey};
  }
`;

const ReplyFormContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${colors.grey};
  background-color: ${colors.greyL};
`;

export default function Comment({
  tokenState,
  drama,
  episode,
  comment,
  userId,
  userRole,
  editHandler,
  deleteHandler,
  likeHandler,
  replyHandeler,
}) {
  const [isModelOpen, setIsModalOpen] = useState(false);
  // const [hasDeleted, setHasdeleted] = useState(false);

  const openModalHandler = () => {
    setIsModalOpen(!isModelOpen);
  };

  const handleDelete = () => {
    deleteComment(tokenState, comment.id).then((result) => {
      if (result.status === 200) {
        // setHasdeleted(true);
        openModalHandler();
        deleteHandler(comment.id);
      }
    });
  };

  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const openReplyHandler = () => {
    setIsReplyOpen(!isReplyOpen);
  };

  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const sendAPICall = async () => {
      const data = await getReplies(tokenState, comment.id);
      setReplies(data);
    };
    sendAPICall();
  }, [isReplyOpen]);

  const addNewReply = (content, createdAt, episodeId, id, userId, parentCommentId) => {
    const newReply = {
      content,
      createdAt,
      episodeId,
      id,
      likeNum: 0,
      parentCommentId,
      updatedAt: createdAt,
      userId,
    };
    setReplies([newReply, ...replies]);
    replyHandeler(parentCommentId, 1);
    //setReplyNum(comment.replyNum + 1);
  };

  // const [content, setContent] = useState(comment.content);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isEditable, setIsEditable] = useState(false);

  const handleTextarea = (e) => {
    setEditedContent(e.target.value);
  };

  const handleEditable = () => {
    setIsEditable(!isEditable);
    setEditedContent(comment.content);
  };

  const handleEditRequest = () => {
    modifyComment(tokenState, comment.id, editedContent).then((result) => {
      setIsEditable(!isEditable);
      editHandler(comment.id, editedContent);
      // setContent(editedContent);
    });
  };

  const editReplyHandler = (replyId, newContent) => {
    const idx = replies.findIndex((rep) => rep.id === replyId);
    // let obj = comments[idx];
    // obj.content = newContent;
    // setComments([obj, ...comments.slice(1, comments.length)]);
    setReplies([
      ...replies.slice(0, idx),
      { ...replies[idx], content: newContent },
      ...replies.slice(idx + 1),
    ]);
  };

  //const [replyNum, setReplyNum] = useState(comment.replyNum);

  const deleteReplyHandler = (replyId) => {
    const idx = replies.findIndex((rep) => rep.id === replyId);
    setReplies([...replies.slice(0, idx), ...replies.slice(idx + 1)]);
    replyHandeler(replies[idx].parentCommentId, 1);
    //setReplyNum(replyNum - 1);
  };

  // const [liked, setLiked] = useState(comment.liked);
  // const [likedNum, setLikedNum] = useState(comment.likeNum);

  const handleLike = () => {
    likeComment(tokenState, comment.id).then((result) => {
      likeHandler(comment.id, result);
    });
  };

  const likeReplyHandler = (replyId, isLiked) => {
    const idx = replies.findIndex((rep) => rep.id === replyId);
    setReplies([
      ...replies.slice(0, idx),
      {
        ...replies[idx],
        liked: isLiked,
        likeNum: isLiked ? ++replies[idx].likeNum : --replies[idx].likeNum,
      },
      ...replies.slice(idx + 1),
    ]);
  };

  const createdAt = new Date(comment.createdAt).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });

  return (
    <>
      {/* <CommentContainer hasDeleted={hasDeleted}> */}
      <CommentContainer>
        <CommentInfoContainer>
          <p>이름없는라마</p>
          <p className="created-date">{createdAt}</p>
        </CommentInfoContainer>
        {isEditable ? (
          <textarea value={editedContent} onChange={handleTextarea}></textarea>
        ) : (
          <p>{comment.content}</p>
        )}
        <ButtonContainer>
          <div>
            {comment.liked ? (
              <IconButton color="primary" onClick={handleLike}>
                <i class="fas fa-heart"></i> <span className="icon-name">Like</span>{' '}
                {comment.likeNum}
              </IconButton>
            ) : (
              <IconButton color="grey" onClick={handleLike}>
                <i class="fas fa-heart"></i> <span className="icon-name">Like</span>{' '}
                {comment.likeNum}
              </IconButton>
            )}

            <IconButton color="grey" onClick={openReplyHandler}>
              <i class="fas fa-comment-alt"></i> <span className="icon-name">Reply</span>{' '}
              {comment.replyNum}
            </IconButton>
          </div>
          {comment.userId === userId ? (
            <div>
              {isEditable ? (
                <div className="edit-comment">
                  <IconButton color="primary" onClick={handleEditable}>
                    <i class="fas fa-times"></i>
                  </IconButton>
                  <IconButton color="secondary" onClick={handleEditRequest}>
                    <i class="fas fa-check"></i>
                  </IconButton>
                </div>
              ) : null}
              {!isEditable ? (
                <div className="edit-comment">
                  <IconButton color="grey" onClick={handleEditable}>
                    <i class="far fa-edit"></i>
                  </IconButton>
                  <IconButton color="grey" onClick={openModalHandler}>
                    <i class="far fa-trash-alt"></i>
                  </IconButton>
                </div>
              ) : null}
            </div>
          ) : null}
          {userRole === 'admin' && comment.userId !== userId ? (
            <IconButton color="grey" onClick={openModalHandler}>
              <i class="far fa-trash-alt"></i>
            </IconButton>
          ) : null}
        </ButtonContainer>
        <Modal
          isOpen={isModelOpen}
          openModalHandler={openModalHandler}
          modalActionlHandler={handleDelete}
          noticeMessage={'정말 삭제하시겠습니까?'}
          buttonMessage={'삭제'}
        />
      </CommentContainer>
      {isReplyOpen ? (
        <div>
          <ReplyFormContainer>
            <CommentForm
              tokenState={tokenState}
              userId={userId}
              dramaId={drama.id}
              dramaName={drama.name}
              seasonIndex={episode.season_number}
              episodeIndex={episode.episode_number}
              episodeId={episode.id}
              addNewComment={addNewReply}
              parentCommentId={comment.id}
            />
          </ReplyFormContainer>
          {replies
            ? replies.map((reply) => (
                <Reply
                  tokenState={tokenState}
                  reply={reply}
                  userId={userId}
                  userRole={userRole}
                  editHandler={editReplyHandler}
                  deleteReplyHandler={deleteReplyHandler}
                  likeHandler={likeReplyHandler}
                />
              ))
            : null}
        </div>
      ) : null}
    </>
  );
}
