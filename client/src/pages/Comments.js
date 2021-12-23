import styled from 'styled-components';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDrama, getEpisode } from '../api/DramaDataAPI';
import { getEpisodeComments } from '../api/CommentsDataAPI';
import { device } from '../styles/Breakpoints';
import { colors } from '../styles/Colors';

const Main = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 850px;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;

  @media ${device.tablet} {
    grid-template-columns: 240px 1fr;
  }
`;

const EpisodeInfo = styled.article`
  h4 {
    color: ${colors.grey};
  }
`;

const Still = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 66%;
  background-color: ${colors.greyL};
  background-image: url(${(props) => props.still});
  background-size: cover;
  background-position: center center;

  @media ${device.tablet} {
    width: 100%;
    padding-bottom: 66%;
  }
`;

const CommentsContainer = styled.div`
  margin-top: 1rem;
`;

const CommentsList = styled.ul`
  padding: 0;
  margin-bottom: 100px;

  @media ${device.tablet} {
    margin-bottom: 2rem;
  }
`;

const CommentFormContainer = styled.div`
  background-color: ${colors.white};
  border-top: 1px solid ${colors.primary};
  padding: 0.5em;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  @media ${device.tablet} {
    position: relative;
    border: 1px solid ${colors.primary};
  }
`;

export default function Comments({ tokenState, userInfo }) {
  // const comments = [
  //   {
  //     id: 123,
  //     episodeId: 1020,
  //     userId: 'alexJ',
  //     content:
  //       'I’ve been looking forward to the new season for such a long time! Finally,Sherlock and Watson are back!',
  //     likeNum: 10,
  //     replyNum: 2,
  //     createdAt: '2021-12-12',
  //     modifiedAt: '2021-12-13',
  //   },
  //   {
  //     id: 124,
  //     episodeId: 1020,
  //     userId: 'lewis',
  //     content: 'It was bit disappointing.',
  //     likeNum: 2,
  //     replyNum: 0,
  //     createdAt: '2021-12-14',
  //     modifiedAt: '2021-12-15',
  //   },
  // ];

  const [drama, setDrama] = useState({});
  const dramaId = useParams().id;
  const seasonNum = useParams().season;
  const episodeNum = useParams().episode;

  useEffect(() => {
    setDrama({});
    const sendAPICall = async () => {
      const data = await getDrama(dramaId);
      setDrama(data);
    };
    sendAPICall();
  }, [dramaId]);

  const [episode, setEpisode] = useState({});

  useEffect(() => {
    setEpisode({});
    const sendAPICall = async () => {
      const data = await getEpisode(dramaId, seasonNum, episodeNum);
      setEpisode(data);
    };
    sendAPICall();
  }, [dramaId, seasonNum, episodeNum]);

  const [comments, setComments] = useState([]);

  const addNewComment = (content, createdAt, episodeId, id, userId) => {
    const newComment = {
      content,
      createdAt,
      episodeId,
      id,
      likeNum: 0,
      parentCommentId: null,
      replyNum: 0,
      updatedAt: createdAt,
      userId,
    };
    setComments([newComment, ...comments]);
  };

  useEffect(() => {
    // setComments([]);
    if (episode.id) {
      const sendAPICall = async () => {
        const data = await getEpisodeComments(tokenState, episode.id);
        // setComments([...data]);
        setComments(data);
      };
      sendAPICall();
    }
  }, [episode]);

  const userId = userInfo ? userInfo.id : undefined;
  const userRole = userInfo ? userInfo.role : undefined;

  const url =
    episode.still_path === null
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png'
      : 'https://www.themoviedb.org/t/p/w1280' + episode.still_path;

  console.log(comments);
  console.log('episode id', episode.id);

  const editHandler = (commentId, newContent) => {
    const idx = comments.findIndex((comment) => comment.id === commentId);
    // let obj = comments[idx];
    // obj.content = newContent;
    // setComments([obj, ...comments.slice(1, comments.length)]);
    setComments([
      ...comments.slice(0, idx),
      { ...comments[idx], content: newContent },
      ...comments.slice(idx + 1),
    ]);
  };

  const deleteHandler = (commentId) => {
    const idx = comments.findIndex((comment) => comment.id === commentId);
    setComments([...comments.slice(0, idx), ...comments.slice(idx + 1)]);
  };

  const likeHandler = (commentId, isLiked) => {
    const idx = comments.findIndex((comment) => comment.id === commentId);
    setComments([
      ...comments.slice(0, idx),
      {
        ...comments[idx],
        liked: isLiked,
        likeNum: isLiked ? ++comments[idx].likeNum : --comments[idx].likeNum,
      },
      ...comments.slice(idx + 1),
    ]);
  };

  return (
    <Main>
      <EpisodeInfo>
        {/* Episode Info */}
        <h1>{drama.name}</h1>
        <h4>{drama.original_name}</h4>
        <h3>
          Season {seasonNum} - Episode {episodeNum} : {episode.name}
        </h3>
        <Still still={url}></Still>
        <p>{episode.overview}</p>
      </EpisodeInfo>
      <CommentsContainer>
        <CommentFormContainer>
          <CommentForm
            tokenState={tokenState}
            userId={userId}
            dramaId={drama.id}
            dramaName={drama.name}
            seasonIndex={episode.season_number}
            episodeIndex={episode.episode_number}
            episodeId={episode.id}
            // commentNum={comments.length}
            addNewComment={addNewComment}
          />
        </CommentFormContainer>
        <CommentsList>
          {/* Comments */}
          {comments.map((comment) => (
            <Comment
              tokenState={tokenState}
              drama={drama}
              episode={episode}
              comment={comment}
              userId={userId}
              userRole={userRole}
              editHandler={editHandler}
              deleteHandler={deleteHandler}
              likeHandler={likeHandler}
            />
          ))}
        </CommentsList>
      </CommentsContainer>
    </Main>
  );
}
