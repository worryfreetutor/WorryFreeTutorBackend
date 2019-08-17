'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;
  const StudentEvaluationForm = app.model.define('StudentEvaluationForm', {
    item_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student_items',
        key: 'item_id',
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
    teacher_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'account',
      },
    },
    score: {
      type: INTEGER,
      allowNull: false,
    },
    comment: {
      type: STRING(512),
      allowNull: false,
    },
    is_anonymous: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: DATE,
    updated_at: DATE,
  },
  {
    tableName: 'student_evaluation_form',
    timestamps: true,
  }
  );

  return StudentEvaluationForm;
};
