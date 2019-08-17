'use strict';

const UserModel = require('./user');
const TeaItemModel = require('./teacherItem');

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN, Op } = app.Sequelize;
  const TeaEvaForm = app.model.define('TeaEvaForm', {
    item_id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: TeaItemModel,
        key: 'item_id',
      },
    },
    student_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: UserModel,
        key: 'account',
      },
    },
    teacher_id: {
      type: STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: UserModel,
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
  }, {
    tableName: 'teacher_evaluation_form',
    timestamps: true,
    scopes: {
      // TODO 确认分数段
      highScore: {
        where: {
          score: {
            [Op.between]: [ 80, 100 ],
          },
        },
      },
      middleScore: {
        where: {
          score: {
            [Op.between]: [ 60, 80 ],
          },
        },
      },
      lowScore: {
        where: {
          score: {
            [Op.between]: [ 0, 60 ],
          },
        },
      },
    },
  });
  return TeaEvaForm;
};
