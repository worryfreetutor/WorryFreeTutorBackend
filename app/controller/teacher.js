'use strict';

const Controller = require('egg').Controller;
const userErrCode = require('../../config/errCode').userErrCode;

class TeacherController extends Controller {
  // 老师申请学生项目
  async applyItems() {
    const { ctx } = this;
    const account = ctx.session.account;
    // 检查老师是否经过身份验证
    // const result = await ctx.service.stuValidate.isTeacher(account);
    // if (result.is_teacher) {
    //   throw ctx.helper.createError('请先进行老师身份验证', userErrCode.validate.noValidateTeacher);
    // }
    // 转化一下item_id值类型为int
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 验证参数
    const options = {
      item_id: 'int',
      birthplace: 'string?',
      sex: [ 'male', 'female' ],
      school: 'string',
      grade: 'string',
      major: 'string',
      experience: 'string?',
      subject: 'string',
      free_time: 'string',
      phone: 'string',
      other: 'string?',
    };
    ctx.validate(options, ctx.request.body);
    const { item_id, birthplace, sex, school, grade, major, experience, subject, free_time, phone, other } = ctx.request.body;
    const Info = {
      item_id,
      teacher_id: account,
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
    };
    ctx.body = await ctx.service.teacher.applyItems(Info);
  }
  // 老师修改申请表
  async modifyApplicationForm() {
    const { ctx } = this;
    // 转化一下item_id值类型为int
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 验证参数
    const options = {
      item_id: 'int',
      teacher_id: 'string',
      birthplace: 'string?',
      sex: [ 'male', 'female' ],
      school: 'string',
      grade: 'string',
      major: 'string',
      experience: 'string?',
      subject: 'string',
      free_time: 'string',
      phone: 'string',
      other: 'string?',
    };
    ctx.validate(options, ctx.request.body);
    const account = ctx.session.account;
    const { item_id, teacher_id, birthplace, sex, school, grade, major, experience, subject, free_time, phone, other } = ctx.request.body;
    if (account !== teacher_id) {
      ctx.body = {
        message: '你不是项目发起人，不能修改项目',
      };
    }
    const Info = {
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
    };
    ctx.body = await ctx.service.teacher.modifyApplicationForm(Info);
  }
  // 老师获取自己某个申请表详情
  async getApplicationFormDetail() {
    const { ctx } = this;
    // 转化一下item_id和teacher_id值类型为int
    if (typeof (ctx.request.query.item_id) === 'string') {
      ctx.request.query.item_id = Number(ctx.request.query.item_id);
    }
    if (typeof (ctx.request.query.teacher_id) === 'string') {
      ctx.request.query.teacher_id = Number(ctx.request.query.teacher_id);
    }
    const options = {
      item_id: 'int',
      teacher_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id, teacher_id } = ctx.query;
    const data = await ctx.service.teacher.getApplicationFormDetail(item_id, teacher_id);
    ctx.body = {
      data,
    };
  }
  // 老师获取申请学生项目的申请表列表
  async getStudentFormList() {
    const { ctx } = this;
    const teacher_id = ctx.session.account;
    const data = await ctx.service.teacher.getStudentFormList(teacher_id);
    ctx.body = {
      data,
    };
  }
  // 老师删除申请表
  async deleteApplicationForm() {
    const { ctx } = this;
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    const options = {
      item_id: 'int',
      teacher_id: 'string',
    };
    ctx.validate(options, ctx.query);
    const { item_id, teacher_id } = ctx.query;
    const { account } = ctx.session.account;
    // 检测用户是否是申请表的发起人
    if (teacher_id !== account) {
      // TODO: 错误码你不是申请表发起人，不能删除申请表
      console.log('你不是申请表发起人，不能删除申请表');
    }
    // 检查项目是否完成，项目完成，申请表不能删除
    const result = await ctx.service.student.getItemsInfoFromDb(item_id);
    if (result.status === 'SUCCESS') {
      // TODO: 抛错
      console.log('项目已经完成，不能删除申请表');
    }
    ctx.body = await ctx.service.teacher.deleteApplicationForm(item_id, teacher_id);
  }
}


module.exports = TeacherController;
