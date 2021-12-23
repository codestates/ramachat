'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.hasMany(models.Comments, {
        foreignKey: 'userId',
      });
      models.Users.hasMany(models.Notifications, {
        foreignKey: 'userId',
      });
      models.Users.hasMany(models.Likes, {
        foreignKey: 'userId',
      });
    }
  }
  Users.init(
    {
      userId: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'Users',
    }
  );
  return Users;
};
