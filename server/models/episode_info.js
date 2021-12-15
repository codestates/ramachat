'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Episode_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Episode_info.init({
    drama_id: DataTypes.INTEGER,
    drama_name: DataTypes.STRING,
    season_index: DataTypes.INTEGER,
    episode_index: DataTypes.INTEGER,
    comment_num: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Episode_info',
  });
  return Episode_info;
};