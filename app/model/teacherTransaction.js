'use strict';
const UserModel = require('./user');
const TeaItemModel = require('./teacherItem');

// 教师项目交易模型
module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize;
  const TeacherTransaction = app.model.define('TeacherTransaction', {
    // 项目id
    item_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: TeaItemModel,
        key: 'item_id',
      },
    },
    // 教师id
    teacher_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    // 学生id
    student_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    // 是否完成
    is_finished: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // 是否评价过
    evaluated: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'teacher_transaction',
    timestamps: true,
  });
  return TeacherTransaction;
};
