'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'user',
      'name',
      Sequelize.BOOLEAN
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'user',
      'name'
    );
  },
};
