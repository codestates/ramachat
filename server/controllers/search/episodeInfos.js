const sequelize = require('../../models').sequelize;
const { EpisodeInfos } = require('../../models');
const axios = require('axios');

module.exports = async (req, res) => {
  let dramaId = -1,
    seasonIndex = -1;
  try {
    dramaId = req.query['drama-id'];
    seasonIndex = req.query['season-index'];
  } catch (err) {
    res.status(400).send('Please provide all necessary information');
  }

  const storedEpisodes = await EpisodeInfos.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(*)
              FROM Comments
              WHERE
              EpisodeInfos.id = Comments.episodeId)`
          ),
          'commentNum',
        ],
      ],
      exclude: ['dramaId', 'dramaName', 'seasonIndex', 'createdAt', 'updatedAt'],
    },
    where: { dramaId, seasonIndex },
  })
    .then((result) => result)
    .catch((err) => {
      res.status(500).send('err');
    });

  let episodeInfos = [];
  // DB에 해당 에피소드 정보가 없을 때
  // tmdb에서 에피소드 정보 받기
  try {
    if (storedEpisodes.length === 0) {
      const searched = await axios.get(
        `https://api.themoviedb.org/3/tv/${dramaId}/season/${seasonIndex}?api_key=${process.env.TMDB_API_KEY}&language=ko-KR`,
        {
          withCredentials: false,
        }
      );

      // 반환 객체 세팅 => 에피소드 정보
      episodeInfos = searched.data.episodes.map((episode, idx) => {
        return {
          id: episode.id,
          episodeIndex: idx + 1,
          commentNum: 0,
        };
      });
      // DB에 해당 에피소드 정보가 있을 때
      // sql DB에서 에피소드 정보 받기
    } else {
      // 반환 객체 세팅 => 에피소드 정보
      episodeInfos = storedEpisodes.map((episode) => {
        return ({ id, episodeIndex, commentNum } = episode.dataValues);
      });
    }
    res.status(200).json(episodeInfos);
  } catch (err) {
    return res.status(500).send('err');
  }
  res.end();
};
