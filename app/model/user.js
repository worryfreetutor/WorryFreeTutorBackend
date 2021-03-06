'use strict';
const { clone } = require('lodash');

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN, Model } = app.Sequelize;
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
    name: {
      type: STRING(16),
      allowNull: true,
    },
    avatar: {
      type: STRING(256),
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
    scopes: {
      // 不需要token认证可以获取的信息
      getInfo: {
        attributes: [ 'account', 'nickname', 'avatar', 'sex', 'per_signature', 'tutor_num', 'average_score' ],
      },
      // 需要token认证获取的信息
      getOwnInfo: {
        attributes: [ 'account', 'nickname', 'name', 'avatar', 'sex', 'per_signature', 'is_teacher', 'is_student', 'tutor_num', 'student_num', 'average_score' ],
      },
    },
    // TODO
    // // 综合评分 用于排序
    // getterMethods: {
    //   rankScore() {
    //     // return ... ;
    //   },
    // },
  });
  Model.prototype.toJSON = function() {
    const data = clone(this.dataValues);
    for (const key in data) {
      if (data[key] === null) data[key] = '';
    }
    data.avatar = data.avatar === '' ?
      'https://feapp-test-1259186164.cos.ap-guangzhou.myqcloud.com/user-avatar/default.jpg'
      : `https://${data.avatar}`;
    return data;
  };
  return User;
};
