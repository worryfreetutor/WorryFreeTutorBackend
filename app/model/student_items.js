'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;
  const StudentItems = app.model.define('StudentItems', {
    item_id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    account: {
      type: STRING(16),
      allowNull: false,
      references: {
        model: 'user',
        key: 'account',
      },
    },
    sex: {
      type: ENUM('MALE', 'FEMALE'),
      defaultValue: 'MALE',
    },
    location: {
      type: STRING(256),
      allowNull: false,
    },
    grade: {
      type: STRING(12),
      allowNull: false,
    },
    tutorial: {
      type: STRING(12),
      allowNull: false,
    },
    free_time: {
      type: STRING(32),
      allowNull: false,
    },
    compensation: {
      type: STRING(8),
      allowNull: false,
    },
    stu_situation: {
      type: STRING(1024),
      allowNull: false,
    },
    sex_demand: {
      type: ENUM('MALE', 'FEMALE', 'UNLIMITED'),
      defaultValue: 'UNLIMITED',
      allowNull: false,
    },
    other_demand: {
      type: STRING(256),
      allowNull: true,
    },
    applicants_num: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: ENUM('SUCCESS', 'EXPIRED', 'ONGOING'),
      defaultValue: 'ONGOING',
      allowNull: false,
    },
    expire_date: DATE,
    updated_at: DATE,
    created_at: DATE,
    deleted_at: DATE,
  },
  {
    tableName: 'student_items',
    timestamps: true,
    paranoid: true,
  }
  );

  return StudentItems;
};
