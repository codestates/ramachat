'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comments.belongsto(models.Users, { foreignKey: 'user_id', targetKey: 'id' });
    }
  }
  Comments.init(
    {
      episode_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      content: DataTypes.STRING,
      likes: DataTypes.INTEGER,
      parent_comment_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comments',
    }
  );
  return Comments;
};
