import axios from 'axios';

export function getEpisodeInfos(dramaId, seasonNumber) {
  return axios
    .get(
      `http://localhost:8000/episode-infos?drama-id=${dramaId}&season-index=${seasonNumber}`,
      {
        withCredentials: true,
      }
    )
    .then((result) => {
      // console.log(result) ;
      return result.episodeInfos;
    });
}