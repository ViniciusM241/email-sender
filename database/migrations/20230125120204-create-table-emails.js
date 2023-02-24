'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('emails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      template: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      html: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      params: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 'envios@sysprocard.com.br',
      },
      cc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cco: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'FINISHED', 'FAILED'),
        allowNull: false,
        default: 'PENDING',
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      requester: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('emails');
  }
};
