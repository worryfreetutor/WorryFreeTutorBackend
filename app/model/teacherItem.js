'use strict';
const UserModel = require('./user');
const { clone } = require('lodash');

// 教师项目模型
module.exports = app => {
  const { STRING, INTEGER, ENUM, DATE, Op, Model } = app.Sequelize;
  const TeacherItem = app.model.define('TeacherItem', {
    // 项目id
    item_id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // 发起人id
    account: {
      type: STRING(16),
      allowNull: false,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    // 发起人姓名
    name: {
      type: STRING(16),
      allowNull: false,
    },
    // 性别
    sex: {
      type: ENUM('MALE', 'FEMALE'),
      defaultValue: 'MALE',
    },
    // 地址
    location: {
      type: STRING(64),
      allowNull: false,
    },
    school: {
      type: STRING(16),
      allowNull: false,
    },
    grade: {
      type: STRING(16),
      allowNull: false,
    },
    major: {
      type: STRING(16),
      allowNull: false,
    },
    // 擅长的科目
    good_subject: {
      type: STRING(64),
      allowNull: true,
    },
    // 个人介绍
    self_introduction: {
      type: STRING(1000),
      allowNull: false,
    },
    // 空闲时间
    free_time: {
      type: STRING(32),
      allowNull: true,
    },
    // 期待的薪资
    expect_compensation: {
      type: STRING(32),
      allowNull: false,
    },
    // 项目状态
    status: {
      type: ENUM('SUCCESS', 'EXPIRED', 'ONGOING'),
      defaultValue: 'ONGOING',
      allowNull: false,
    },
    expire_date: {
      type: DATE,
      allowNull: true,
      validate: {
        // 验证当前时间是否合法
        isAfter: new Date().toISOString().slice(0, 10),
      },
    },
  },
  {
    tableName: 'teacher_items',
    timestamps: true,
    scopes: {
      // 获取项目列表时的作用域
      itemlist: {
        attributes: [ 'item_id', 'account', 'name', 'sex', 'good_subject', 'expect_compensation' ],
        where: {
          status: {
            [Op.eq]: 'ONGOING',
          },
        },
      },
    },
  });
  Model.prototype.toJSON = function() {
    const data = clone(this.dataValues);
    for (const key in data) {
      if (data[key] === null) data[key] = '';
    }
    return data;
  };
  return TeacherItem;
};
