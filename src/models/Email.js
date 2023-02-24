const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../../config/database');
const sequelize = new Sequelize(dbConfig);

const Email = sequelize.define("emails", {
  template: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  html: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  params: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'envios@sysprocard.com.br',
  },
  cc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'FINISHED', 'FAILED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  requester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Email;
