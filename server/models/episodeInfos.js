'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EpisodeInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.EpisodeInfos.hasMany(models.Comments, {
        foreignKey: 'episodeId',
      });
    }
  }
  EpisodeInfos.init(
    {
      dramaId: DataTypes.INTEGER,
      dramaName: DataTypes.STRING,
      seasonIndex: DataTypes.INTEGER,
      episodeIndex: DataTypes.INTEGER,
      // commentNum: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: 0,
      // },
    },
    {
      sequelize,
      modelName: 'EpisodeInfos',
    }
  );
  return EpisodeInfos;
};
