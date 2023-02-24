'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all(
      await queryInterface.changeColumn('emails', 'cc', {
        type: Sequelize.TEXT,
      }),
      await queryInterface.changeColumn('emails', 'cco', {
        type: Sequelize.TEXT,
      })
    );
  },

  async down (queryInterface, Sequelize) {
  await Promise.all(
      await queryInterface.changeColumn('emails', 'cc', {
        type: Sequelize.STRING,
      }),
      await queryInterface.changeColumn('emails', 'cco', {
        type: Sequelize.STRING,
      })
    );
  },
};
