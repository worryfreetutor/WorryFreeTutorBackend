'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, BOOLEAN } = app.Sequelize;
  const TeacherRegistrationForm = app.model.define('TeacherRegistrationForm', {
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
      primaryKey: true,
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
    birthplace: {
      type: STRING(32),
      allowNull: false,
    },
    school: {
      type: STRING(16),
      allowNull: false,
    },
    grade: {
      type: STRING(12),
      allowNull: true,
    },
    major: {
      type: STRING(16),
      allowNull: false,
    },
    experience: {
      type: STRING(1024),
      allowNull: false,
    },
    subject: {
      type: STRING(64),
      allowNull: true,
    },
    free_time: {
      type: STRING(32),
      allowNull: false,
    },
    phone: {
      type: STRING(16),
      allowNull: false,
    },
    other: {
      type: STRING(512),
      allowNull: true,
    },
    is_choosed: {
      type: BOOLEAN,
      defaultValue: false,
    },
    created_at: DATE,
    updated_at: DATE,
  },
  {
    tableName: 'teacher_registration_form',
    timestamps: true,
  }
  );

  return TeacherRegistrationForm;
};
