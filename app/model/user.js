'use strict';

module.exports = app => {
  const { STRING, ENUM, BOOLEAN } = app.Sequelize;
  const User = app.model.define('User', {
    account: {
      type: STRING(32),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    password: {
      type: STRING(256),
      allowNull: false,
    },
    nickname: {
      type: STRING(32),
      allowNull: true,
    },
    avatar: {
      type: STRING(256),
      allowNull: true,
    },
    sex: {
      type: ENUM('MALE', 'FEMALE', 'SECRET'),
    },
    isTeacher: {
      type: BOOLEAN,
    },
    isStudent: {
      type: BOOLEAN,
    },
  },
  {
    tableName: 'user',
    timestamps: true,
  });
  return User;
};
