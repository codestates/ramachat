import styled from 'styled-components';
import { useState } from 'react';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import IconButton from './IconButton';
import { modifyComment, deleteComment, likeComment } from '../api/CommentsDataAPI';
import Modal from './Modal';

const ReplyContainer = styled.article`
  width: 100%;
  padding: 1rem;
  padding-left: 2rem;
  border-top: 1px solid ${colors.grey};
  background-color: ${colors.greyL};

  textarea {
    width: 100%;
  }
`;

const ReplyInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .created-date {
    color: ${colors.grey};
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

export default function Reply({
  tokenState,
  reply,
  userId,
  userRole,
  editHandler,
  deleteReplyHandler,
  likeHandler,
}) {
  const [editedContent, setEditedContent] = useState(reply.content);
  const [isEditable, setIsEditable] = useState(false);
  const [isModelOpen, setIsModalOpen] = useState(false);

  const handleTextarea = (e) => {
    setEditedContent(e.target.value);
  };

  const handleEditable = () => {
    setIsEditable(!isEditable);
    setEditedContent(reply.content);
  };

  const handleEditRequest = () => {
    modifyComment(tokenState, reply.id, editedContent).then((result) => {
      setIsEditable(!isEditable);
      editHandler(reply.id, editedContent);
    });
  };

  const openModalHandler = () => {
    setIsModalOpen(!isModelOpen);
  };

  const handleDelete = () => {
    deleteComment(tokenState, reply.id).then((result) => {
      if (result.status === 200) {
        // setHasdeleted(true);
        openModalHandler();
        deleteReplyHandler(reply.id);
      }
    });
  };

  const [liked, setLiked] = useState(reply.liked);
  const [likedNum, setLikedNum] = useState(reply.likeNum);

  const handleLike = () => {
    likeComment(tokenState, reply.id).then((result) => {
      likeHandler(reply.id, result);
    });
  };

  const createdAt = new Date(reply.createdAt).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });

  return (
    <ReplyContainer>
      <ReplyInfoContainer>
        <p>└ 이름없는라마</p>
        <p className="created-date">{createdAt}</p>
      </ReplyInfoContainer>
      {isEditable ? (
        <textarea value={editedContent} onChange={handleTextarea}></textarea>
      ) : (
        <p>{reply.content}</p>
      )}
      <ButtonContainer>
        <div>
          {reply.liked ? (
            <IconButton color="primary" onClick={handleLike}>
              <i class="fas fa-heart"></i> <span className="icon-name">Like</span>{' '}
              {reply.likeNum}
            </IconButton>
          ) : (
            <IconButton color="grey" onClick={handleLike}>
              <i class="fas fa-heart"></i> <span className="icon-name">Like</span>{' '}
              {reply.likeNum}
            </IconButton>
          )}
        </div>
        {reply.userId === userId ? (
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
        {userRole === 'admin' && reply.userId !== userId ? (
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
    </ReplyContainer>
  );
}
