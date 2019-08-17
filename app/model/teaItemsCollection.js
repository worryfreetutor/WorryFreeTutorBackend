'use strict';
const UserModel = require('./user');
const TeaItemModel = require('./teacherItem');

// 教师项目模型
module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;
  const TeaItemsCollection = app.model.define('TeaItemsCollection', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account: {
      type: STRING,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    item_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: TeaItemModel,
        key: 'item_id',
      },
    },
  },
  {
    tableName: 'teacher_items_collection',
    timestamps: true,
  });
  TeaItemsCollection.associate = function() {
    TeaItemsCollection.Item = TeaItemsCollection.belongsTo(app.model.TeacherItem, {
      foreignKey: 'item_id',
    });
  };
  return TeaItemsCollection;
};
