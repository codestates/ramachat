import styled from 'styled-components';
import TextButton from './TextButton';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import { postComment } from '../api/CommentsDataAPI';
import { useState } from 'react';
import Modal from './Modal';

const Input = styled.textarea`
  width: 100%;
  padding: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 0.5rem;

  @media ${device.tablet} {
    flex-direction: column;
    align-items: flex-end;
  }
`;

export default function CommentForm({
  tokenState,
  userId,
  dramaId,
  dramaName,
  seasonIndex,
  episodeIndex,
  episodeId,
  // commentNum,
  addNewComment,
  parentCommentId,
}) {
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleChange = (e) => {
    setContent(e.target.value);
    console.log(content);
  };
  const openModalHandler = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (!userId) {
      setIsModalOpen(true);
    } else if (content !== '') {
      postComment(
        tokenState,
        userId,
        content,
        dramaId,
        dramaName,
        seasonIndex,
        episodeIndex,
        episodeId,
        // commentNum
        parentCommentId
      ).then((result) => {
        addNewComment(
          content,
          result.data.createdAt,
          episodeId,
          result.data.id,
          userId,
          parentCommentId
        );
        setContent('');
      });
    } else {
    }
  };

  return (
    <>
      <Form>
        <Input
          type="text"
          placeholder="메시지를 입력하세요"
          value={content}
          onChange={handleChange}
        ></Input>
        <TextButton
          color="primary"
          isTransparent={false}
          width="fit"
          onClick={handleClick}
        >
          보내기
        </TextButton>
      </Form>
      <Modal
        isOpen={isModalOpen}
        noticeMessage={'로그인이 필요합니다.'}
        buttonMessage={'로그인'}
        endPoint={'/login'}
        openModalHandler={openModalHandler}
      />
    </>
  );
}
