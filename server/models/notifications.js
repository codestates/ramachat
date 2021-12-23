'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Notifications.belongsTo(models.Users, {
        onDelete: 'cascade',
        foreignKey: 'id',
      });
      models.Notifications.belongsTo(models.Comments, {
        onDelete: 'cascade',
        foreignKey: 'id',
      });
    }
  }
  Notifications.init(
    {
      userId: DataTypes.INTEGER,
      commentId: DataTypes.INTEGER,
      isChecked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Notifications',
    }
  );
  return Notifications;
};
