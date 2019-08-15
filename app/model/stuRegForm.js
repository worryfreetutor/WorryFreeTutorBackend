'use strict';
const UserModel = require('./user');
const TeaItemModel = require('./teacherItem');
const { clone } = require('lodash');

// 教师项目报名模型
module.exports = app => {
  const { STRING, INTEGER, ENUM, BOOLEAN, Model, Op } = app.Sequelize;
  const StuRegForm = app.model.define('StuRegForm', {
    item_id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: TeaItemModel,
        key: 'item_id',
      },
    },
    // 报名的学生id
    student_id: {
      type: STRING(16),
      primaryKey: true,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    // 性别
    sex: {
      type: ENUM('MALE', 'FEMALE'),
      defaultValue: 'MALE',
    },
    // 补习科目
    tutorial: {
      type: STRING(12),
      allowNull: false,
    },
    // 地址
    location: {
      type: STRING(256),
      allowNull: false,
    },
    // 空闲时间
    free_time: {
      type: STRING(32),
      allowNull: false,
    },
    // 学习情况
    stu_situation: {
      type: STRING(1024),
      allowNull: true,
    },
    // 其他
    other_situation: {
      type: STRING(512),
      allowNull: true,
    },
    // 是否被选择
    is_choosed: {
      type: BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'student_registration_form',
    timestamps: true,
    scopes: {
      // 获取简略信息时的作用域
      simple: {
        attributes: [ 'item_id', 'student_id', 'is_choosed' ],
      },
      // 获取被选中的信息 的作用域
      choosed: {
        attributes: [ 'item_id', 'student_id' ],
        where: {
          is_choosed: {
            [Op.eq]: true,
          },
        },
      },
    },
  });
  // 输出时将null替换为空值
  Model.prototype.toJSON = function() {
    const data = clone(this.dataValues);
    for (const key in data) {
      if (data[key] === null) data[key] = '';
    }
    return data;
  };
  return StuRegForm;
};
