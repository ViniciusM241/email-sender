'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all(
      await queryInterface.addColumn('emails', 'attachments', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
    );
  },

  async down (queryInterface, Sequelize) {
  await Promise.all(
      await queryInterface.removeColumn('emails', 'attachments')
    );
  },
};
