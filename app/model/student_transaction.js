'use strict';

module.exports = app => {
  const { STRING, BOOLEAN, INTEGER, DATE, ENUM } = app.Sequelize;
  const StudentTransaction = app.model.define('StudentTransaction', {
    item_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student_items',
        key: 'item_id',
      },
    },
    teacher_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'account',
      },
    },
    student_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'account',
      },
    },
    // status: {
    //   type: ENUM('SUCCESS', 'FAIL', 'ONGOING'),
    //   defaultValue: 'ONGOING',
    //   allowNull: false,
    // },
    is_finished: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    evaluated: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: DATE,
    updated_at: DATE,
  },
  {
    tableName: 'student_transaction',
    timestamps: true,
  }
  );

  return StudentTransaction;
};
