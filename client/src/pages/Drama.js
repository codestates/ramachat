import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import { getDrama, getEpisodes } from '../api/DramaDataAPI';
import { getEpisodeInfos } from '../api/CommentsDataAPI';
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SeasonSelect from '../components/SeasonSelect';
import EpisodeListItem from '../components/EpisodeListItem';

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

const DramaInfo = styled.article`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-content: flex-start;

  @media ${device.tablet} {
    width: 240px;
  }

  h4 {
    color: ${colors.grey};
  }
`;

const Poster = styled.div`
  width: 33%;
  height: 0;
  padding-bottom: 50%;
  background-color: ${colors.greyL};
  background-image: url(${(props) => props.poster});
  background-size: cover;
  background-position: center center;

  @media ${device.tablet} {
    width: 100%;
    padding-bottom: 150%;
  }
`;

const EpisodeList = styled.article`
  ul {
    padding: 0;
  }
`;

export default function Drama() {
  const [drama, setDrama] = useState({});
  // const dramaId = new URLSearchParams(useLocation().search).get('drama-id');
  const dramaId = useParams().id;

  useEffect(() => {
    setDrama({});
    const sendAPICall = async () => {
      const data = await getDrama(dramaId);
      setDrama(data);
    };
    sendAPICall();
  }, [dramaId]);

  const url =
    drama.poster_path === null
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png'
      : 'https://www.themoviedb.org/t/p/w1280' + drama.poster_path;

  const period = drama.first_air_date
    ? drama.first_air_date.slice(0, 4) + ' - ' + drama.last_air_date.slice(0, 4)
    : '';

  const genres = drama.genres ? drama.genres.map((genre) => genre.name).join(', ') : '';

  const [episodes, setEpisodes] = useState([]);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [episodeInfos, setEpisodeInfos] = useState([]);

  useEffect(() => {
    setEpisodes([]);
    const sendAPICall = async () => {
      const data = await getEpisodes(dramaId, seasonNumber);
      setEpisodes(data);
      const infoData = await getEpisodeInfos(dramaId, seasonNumber);
      // const infoData = await getEpisodeInfos(71446, 1);
      setEpisodeInfos(infoData);
    };
    sendAPICall();
  }, [seasonNumber]);

  return (
    <Main>
      <DramaInfo>
        <Poster poster={url}></Poster>
        <div>
          <h1>{drama.name}</h1>
          {drama.name !== drama.original_name ? <h4>{drama.original_name}</h4> : null}
          <p>{period}</p>
          <p>{genres}</p>
        </div>
        <p>{drama.overview}</p>
      </DramaInfo>
      <EpisodeList>
        <h3>Episodes</h3>
        <SeasonSelect seasons={drama.seasons} setSeasonNumber={setSeasonNumber} />
        <ul>
          {episodes.length !== 0
            ? episodes.map((episode) => (
                <EpisodeListItem episode={episode} episodeInfos={episodeInfos} />
              ))
            : null}
        </ul>
      </EpisodeList>
    </Main>
  );
}
