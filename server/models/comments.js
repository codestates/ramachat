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
      models.Comments.hasOne(models.Users, {
        foreignKey: 'id',
      });
      models.Comments.belongsTo(models.EpisodeInfos, {
        onDelete: 'cascade',
        foreignKey: 'id',
      });
      models.Comments.hasMany(models.Notifications, {
        foreignKey: 'commentId',
      });
      models.Comments.hasMany(models.Likes, {
        foreignKey: 'targetId',
      });
    }
  }
  Comments.init(
    {
      episodeId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      content: DataTypes.STRING,
      parentCommentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comments',
    }
  );
  return Comments;
};
