'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const StudentItemsCollection = app.model.define('StudentItemsCollection', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account: {
      type: STRING,
      allowNull: false,
      references: {
        model: 'user',
        key: 'account',
      },
    },
    item_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'student_items',
        key: 'item_id',
      },
    },
    created_at: DATE,
    updated_at: DATE,
  },
  {
    tableName: 'student_items_collection',
    timestamps: true,
  }
  );

  return StudentItemsCollection;
};
