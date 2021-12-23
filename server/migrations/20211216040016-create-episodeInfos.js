'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EpisodeInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dramaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      dramaName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      seasonIndex: {
        type: Sequelize.INTEGER,
      },
      episodeIndex: {
        type: Sequelize.INTEGER,
      },
      // commentNum: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 0,
      // },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EpisodeInfos');
  },
};
