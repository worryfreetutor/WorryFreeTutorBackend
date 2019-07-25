'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, ENUM, BOOLEAN, DATE } = Sequelize;
    await queryInterface.createTable('student_items', {
      item_id: {
        type: STRING(16),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
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
        type: STRING(64),
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
        type: STRING(8),
        allowNull: false,
      },
      status: {
        type: ENUM('SUCCESS', 'EXPIRED', 'ONGOING'),
        defaultValue: 'ONGOING',
        allowNull: false,
      },
      create_time: DATE,
      expire_date: DATE,
    });
    await queryInterface.createTable('teacher_items', {
      item_id: {
        type: STRING(16),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      account: {
        type: STRING(16),
        allowNull: false,
        references: {
          model: 'user',
          key: 'account',
        },
      },
      name: {
        type: STRING(16),
        allowNull: false,
      },
      sex: {
        type: ENUM('MALE', 'FEMALE'),
        defaultValue: 'MALE',
      },
      location: {
        type: STRING(64),
        allowNull: false,
      },
      school: {
        type: STRING(16),
        allowNull: false,
      },
      grade: {
        type: STRING(16),
        allowNull: false,
      },
      major: {
        type: STRING(16),
        allowNull: false,
      },
      good_subject: {
        type: STRING(64),
        allowNull: true,
      },
      tutor_num: {
        type: STRING(8),
        defaultValue: '0',
      },
      self_introduction: {
        type: STRING(1000),
        allowNull: false,
      },
      free_time: {
        type: STRING(32),
        allowNull: true,
      },
      expect_compensation: {
        type: STRING(32),
        allowNull: false,
      },
      status: {
        type: ENUM('SUCCESS', 'EXPIRED', 'ONGOING'),
        defaultValue: 'ONGOING',
        allowNull: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    await queryInterface.createTable('student_transaction', {
      item_id: {
        type: STRING(16),
        allowNull: false,
        references: {
          model: 'student_items',
          key: 'item_id',
        },
      },
      teacher_id: {
        type: STRING(16),
        allowNull: false,
      },
      student_id: {
        type: STRING(16),
        allowNull: false,
      },
      status: {
        type: ENUM('SUCCESS', 'FAIL', 'ONGOING'),
        defaultValue: 'ONGOING',
        allowNull: false,
      },
      is_finished: {
        type: BOOLEAN,
        allowNUll: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    await queryInterface.createTable('teacher_transaction', {
      item_id: {
        type: STRING(16),
        allowNull: false,
        references: {
          model: 'teacher_items',
          key: 'item_id',
        },
      },
      teacher_id: {
        type: STRING(16),
        allowNull: false,
      },
      student_id: {
        type: STRING(16),
        allowNull: false,
      },
      status: {
        type: ENUM('SUCCESS', 'FAIL', 'ONGOING'),
        defaultValue: 'ONGOING',
        allowNull: false,
      },
      is_finished: {
        type: BOOLEAN,
        allowNUll: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    queryInterface.createTable('student_registration_form', {
      item_id: {
        type: STRING(16),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'student_items',
          key: 'item_id',
        },
      },
      student_id: {
        type: STRING(16),
        primaryKey: true,
        allowNull: false,
      },
      tutorial: {
        type: STRING(12),
        allowNull: false,
      },
      location: {
        type: STRING(64),
        allowNull: false,
      },
      free_time: {
        type: STRING(32),
        allowNull: false,
      },
      stu_situation: {
        type: STRING(1024),
        allowNull: true,
      },
      other_situation: {
        type: STRING(512),
        allowNull: true,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    queryInterface.createTable('teacher_registration_form', {
      item_id: {
        type: STRING(16),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'teacher_items',
          key: 'item_id',
        },
      },
      teacher_id: {
        type: STRING(16),
        primaryKey: true,
        allowNull: false,
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
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_items');
    await queryInterface.dropTable('teacher_items');
    await queryInterface.dropTable('student_transaction');
    await queryInterface.dropTable('teacher_transaction');
    await queryInterface.dropTable('student_registration_form');
    await queryInterface.dropTable('teacher_registration_form');
  },
};
