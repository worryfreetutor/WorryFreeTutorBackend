'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { STRING, ENUM, BOOLEAN, DATE } = Sequelize;
    await queryInterface.createTable('user', {
      account: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      password: {
        type: STRING(256),
        allowNull: false,
      },
      nickname: {
        type: STRING(32),
        allowNull: true,
      },
      avatar: {
        type: STRING(256),
        allowNull: true,
      },
      sex: {
        type: ENUM('MALE', 'FEMALE', 'SECRET'),
        defaultValue: 'SECRET',
      },
      is_teacher: {
        type: BOOLEAN,
        defaultValue: false,
      },
      is_student: {
        type: BOOLEAN,
        defaultValue: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    await queryInterface.createTable('validation', {
      account: {
        type: STRING(16),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'user',
          key: 'account',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      authentication: {
        type: ENUM('STU', 'TEA'),
        allowNull: false,
      },
      stu_account: {
        type: STRING(32),
        allowNull: true,
      },
      id_number: {
        type: STRING(32),
        allowNull: true,
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  // 在执行数据库降级时调用的函数，删除 users 表
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('validation');
    await queryInterface.dropTable('user');
  },
};
