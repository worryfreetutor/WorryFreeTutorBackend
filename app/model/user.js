'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN } = app.Sequelize;
  const User = app.model.define('User', {
    account: {
      type: STRING(32),
      primaryKey: true,
      allowNull: false,
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
    name: {
      type: STRING(32),
      allowNull: true,
    },
    sex: {
      type: ENUM('MALE', 'FEMALE', 'SECRET'),
      defaultValue: 'SECRET',
    },
    per_signature: {
      type: STRING(256),
      allowNull: true,
    },
    is_teacher: {
      type: BOOLEAN,
      defaultValue: false,
    },
    is_student: {
      type: BOOLEAN,
      defaultValue: false,
    },
    tutor_num: {
      type: INTEGER,
      defaultValue: 0,
    },
    student_num: {
      type: INTEGER,
      defaultValue: 0,
    },
    average_score: {
      type: INTEGER,
      defaultValue: 0,
    },
    created_at: DATE,
    updated_at: DATE,
  },
  {
    tableName: 'user',
    timestamps: true,
  });
  return User;
};
