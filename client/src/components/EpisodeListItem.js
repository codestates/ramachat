import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { useNavigate } from 'react-router-dom';
import { device } from '../styles/Breakpoints';

const Item = styled.li`
  list-style: none;
  display: grid;
  gap: 1rem;
  grid-template-columns: 150px 1fr 60px;
  padding: 1rem;
  align-items: center;
  border-top: 1px solid ${colors.primary};
  cursor: pointer;

  &:hover {
    background-color: ${colors.primaryL};
  }

  .still {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 66%;
    grid-column: 1 / 4;
    background-color: ${colors.greyL};
    background-image: url(${(props) => props.still});
    background-size: cover;
    background-position: center center;
    @media ${device.tablet} {
      grid-column: 1 / 2;
    }
  }
  h4 {
    margin: 0;
    grid-column: 1 / 3;
    @media ${device.tablet} {
      grid-column: 2 / 3;
    }
  }
  .overview {
    grid-column: 1 / span 3;
  }
  .comment {
    margin: 0;
    text-align: right;
    color: ${colors.primary};
  }
`;

export default function EpisodeListItem({ episode, episodeInfos }) {
  const url =
    episode.still_path === null
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png'
      : 'https://www.themoviedb.org/t/p/w1280' + episode.still_path;
  const filteredInfos = episodeInfos.filter(
    (ep) => ep.episodeIndex == episode.episode_number
  );
  const commentNum = filteredInfos.length !== 0 ? filteredInfos[0].commentNum : '0';

  let navigate = useNavigate();
  const handleClick = () => {
    navigate(
      `./comments/season/${episode.season_number}/episode/${episode.episode_number}/`
    );
  };

  return (
    <Item still={url} onClick={handleClick}>
      <div className="still"></div>
      <h4>
        {episode.episode_number}. {episode.name}
      </h4>
      <p className="comment">
        <i className="fas fa-comment-alt"></i> {commentNum}
      </p>
      {episode.overview ? <p className="overview">{episode.overview}</p> : null}
    </Item>
  );
}
