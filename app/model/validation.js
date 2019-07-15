'use strict';
const UserModel = require('./user');

module.exports = app => {
  const { STRING, ENUM } = app.Sequelize;
  const Validation = app.model.define('Validation', {
    account: {
      type: STRING(16),
      primaryKey: true,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    authentication: {
      type: ENUM('STU', 'TEA'),
    },
    stu_account: {
      type: STRING(32),
      allowNull: true,
    },
    id_number: {
      type: STRING(32),
      allowNull: true,
    },
  },
  {
    tableName: 'validation',
    timestamps: true,
  });
  return Validation;
};
