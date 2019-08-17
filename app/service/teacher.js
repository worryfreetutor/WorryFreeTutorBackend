'use strict';

const Service = require('egg').Service;

class TeacherService extends Service {
  // 根据通过项目id从数据库中获取相应的学生id
  async getStudentIdfromDB(item_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentItems.findOne({
        attributes: [ 'account' ],
        where: { item_id },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/teacher/从数据库中获取学生id 未知错误');
    }
    return result.dataValues.account;
  }
  // 老师申请学生的项目
  async applyItems(Info) {
    const { ctx } = this;
    // 性别化为大写
    Info.sex = Info.sex.toUpperCase();
    const { item_id, teacher_id, birthplace, sex, school, grade, major, experience, subject, free_time, phone, other } = Info;
    try {
      await ctx.model.TeacherRegistrationForm.create({
        item_id,
        teacher_id,
        birthplace,
        sex,
        school,
        grade,
        major,
        experience,
        subject,
        free_time,
        phone,
        other,
      });
      // 项目表的报名人数自增1
      await ctx.model.StudentItems.increment('applicants_num', {
        where: {
          item_id,
        },
      });
      // const student_id = await this.getStudentIdfromDB(item_id);
      // await ctx.model.StudentTransaction.create({
      //   item_id,
      //   teacher_id,
      //   student_id,
      // });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/teacher/申请学生项目 未知错误');
    }
    return {
      message: '申请成功',
    };
  }
  // 老师修改申请表内容
  async modifyApplicationForm(Info) {
    const { ctx } = this;
    const { item_id, teacher_id, birthplace, sex, school, grade, major, experience, subject, free_time, phone, other } = Info;
    try {
      await ctx.model.TeacherRegistrationForm.update({
        birthplace,
        sex,
        school,
        grade,
        major,
        experience,
        subject,
        free_time,
        phone,
        other,
      }, { where: { item_id, teacher_id } });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/teacher/modifyApplicationForm, 未知错误');
    }
    return {
      message: '修改成功',
    };
  }
  // 获取老师申请表列表
  async getStudentFormList(teacher_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.TeacherRegistrationForm.findAll({
        attributes: [ 'item_id', 'is_choosed' ],
        where: {
          teacher_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/teacher/获取申请学生项目申请表列表未知错误');
    }
    return result;
  }
  // 获取老师某个申请表详细信息
  async getApplicationFormDetail(item_id, teacher_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.TeacherRegistrationForm.findOne({
        where: {
          item_id,
          teacher_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/teacher/getApplicationFormDetail,获取申请表详情未知错误');
    }
    return result.dataValues;
  }
  // 删除老师申请表
  async deleteApplicationForm(item_id, teacher_id) {
    const { ctx } = this;
    try {
      await ctx.model.TeacherRegistrationForm.destroy({
        where: {
          item_id,
          teacher_id,
        },
      });
      // 项目表的报名人数自减1
      await ctx.model.StudentItems.decrement('applicants_num', {
        where: {
          item_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/teacher/deleteApplicationForm,删除申请表未知错误');
    }
    return {
      message: '删除成功',
    };
  }
}


module.exports = TeacherService;
