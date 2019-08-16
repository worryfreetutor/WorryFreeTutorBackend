'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, ENUM, BOOLEAN, DATE } = Sequelize;
    // 用户信息表
    await queryInterface.createTable('user', {
      account: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
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
      name: {
        type: STRING(32),
        allowNull: true,
      },
      sex: {
        type: ENUM('MALE', 'FEMALE', 'SECRET'),
        defaultValue: 'SECRET',
      },
      per_signature: {
        type: STRING(256),
        allowNull: true,
      },
      is_teacher: {
        type: BOOLEAN,
        defaultValue: false,
      },
      is_student: {
        type: BOOLEAN,
        defaultValue: false,
      },
      tutor_num: {
        type: INTEGER,
        defaultValue: 0,
      },
      student_num: {
        type: INTEGER,
        defaultValue: 0,
      },
      average_score: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    // 身份验证表
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
        primaryKey: true,
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
    // 学生找老师项目表
    await queryInterface.createTable('student_items', {
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
      expire_date: {
        type: DATE,
        allowNull: true,
      },
      updated_at: DATE,
      created_at: DATE,
      deleted_at: DATE,
    });
    // 老师找学生项目表
    await queryInterface.createTable('teacher_items', {
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
      name: {
        type: STRING(16),
        allowNull: false,
      },
      sex: {
        type: ENUM('MALE', 'FEMALE'),
        defaultValue: 'MALE',
      },
      location: {
        type: STRING(256),
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
      expire_date: {
        type: DATE,
        allowNull: true,
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE,
    });
    // 学生找老师项目交易记录表
    await queryInterface.createTable('student_transaction', {
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
    });
    // 老师找学生项目交易记录表
    await queryInterface.createTable('teacher_transaction', {
      item_id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'teacher_items',
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
    });
    // 学生报名教师项目表
    await queryInterface.createTable('student_registration_form', {
      item_id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'teacher_items',
          key: 'item_id',
        },
      },
      student_id: {
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
      tutorial: {
        type: STRING(12),
        allowNull: false,
      },
      location: {
        type: STRING(256),
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
      is_choosed: {
        type: BOOLEAN,
        defaultValue: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
    // 老师申请表
    await queryInterface.createTable('teacher_registration_form', {
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
    });
    // 学生项目评价表
    await queryInterface.createTable('student_evaluation_form', {
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
    });
    // 老师项目评价表
    await queryInterface.createTable('teacher_evaluation_form', {
      item_id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'teacher_items',
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
    });
    // 学生项目收藏表
    await queryInterface.createTable('student_items_collection', {
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
    });
    // 教师项目收藏表
    await queryInterface.createTable('teacher_items_collection', {
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
          model: 'teacher_items',
          key: 'item_id',
        },
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  // 在执行数据库降级时调用的函数，删除 users 表
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_items_collection');
    await queryInterface.dropTable('teacher_items_collection');
    await queryInterface.dropTable('student_evaluation_form');
    await queryInterface.dropTable('teacher_evaluation_form');
    await queryInterface.dropTable('student_registration_form');
    await queryInterface.dropTable('teacher_registration_form');
    await queryInterface.dropTable('student_transaction');
    await queryInterface.dropTable('teacher_transaction');
    await queryInterface.dropTable('student_items');
    await queryInterface.dropTable('teacher_items');
    await queryInterface.dropTable('validation');
    await queryInterface.dropTable('user');
  },
};

// item_id student_id teacher_id 评分 评价

