'use strict';
const userErrCode = require('../../config/errCode').userErrCode;
const Controller = require('egg').Controller;

class StudentController extends Controller {
  // 学生发布项目找老师
  async publishItems() {
    const { ctx } = this;
    // 判断是否经过学生身份验证
    const account = ctx.session.account;
    // const result = await ctx.service.stuValidate.isStudent(account);
    // if (!result.is_student) {
    //   throw ctx.helper.createError('请先进行学生身份验证', userErrCode.validate.noValidateStudent);
    // }
    // 参数验证
    const options = {
      sex: [ 'male', 'female' ],
      location: 'string',
      grade: 'string',
      tutorial: 'string',
      free_time: 'string',
      compensation: 'string',
      stu_situation: 'string',
      sex_demand: [ 'female', 'male', 'unlimited' ],
      other_demand: 'string?',
      expire_date: 'string',
    };
    ctx.validate(options, ctx.request.body);
    const { sex, location, grade, tutorial, free_time, compensation, stu_situation, sex_demand, other_demand, expire_date } = ctx.request.body;
    const itemInfo = {
      account,
      sex,
      location,
      grade,
      tutorial,
      free_time,
      compensation,
      stu_situation,
      sex_demand,
      other_demand,
      expire_date,
    };
    ctx.body = await ctx.service.student.publish(itemInfo);
  }
  // 学生修改已经发布的项目
  async modifyItems() {
    const { ctx } = this;
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 参数验证
    const options = {
      item_id: 'int',
      sex: [ 'male', 'female' ],
      location: 'string',
      grade: 'string',
      tutorial: 'string',
      free_time: 'string',
      compensation: 'string',
      stu_situation: 'string',
      sex_demand: [ 'female', 'male', 'unlimited' ],
      other_demand: 'string',
      expire_date: 'string',
    };
    ctx.validate(options, ctx.request.body);
    const account = ctx.session.account;
    const { item_id, sex, location, grade, tutorial, free_time, compensation, stu_situation, sex_demand, other_demand, expire_date } = ctx.request.body;
    const itemInfo = {
      item_id,
      account,
      sex,
      location,
      grade,
      tutorial,
      free_time,
      compensation,
      stu_situation,
      sex_demand,
      other_demand,
      expire_date,
    };
    ctx.body = await ctx.service.student.modifyItems(itemInfo);
  }
  // 学生删除项目
  async deleteItems() {
    const { ctx } = this;
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id } = ctx.query;
    // 确定请求发起人是项目的发布人
    const reqAccount = ctx.session.account;
    const { account, applicants_num } = await ctx.service.student.getItemsInfoFromDb(item_id);
    if (reqAccount !== account) {
      // TODO:你不是项目发起人，无法修改项目throw ERR
      console.log('你不是项目发起人，无法修改项目');
    }
    if (applicants_num !== 0) {
      // TODO:申请人不为0，你不能删除项目，只能将项目设置为完成。
      console.log('申请人不为0，你不能删除项目，只能将项目设置为完成。');
    }
    ctx.body = await ctx.service.student.deleteItems(item_id);
  }
  // 获取学生项目列表
  async getItemList() {
    const { ctx } = this;
    const itemList = await ctx.service.student.getItemList();
    ctx.body = {
      itemList,
    };
  }
  // 获取学生历史项目列表
  async getHistroyItemList() {
    const { ctx } = this;
    const account = ctx.session.account;
    const itemList = await ctx.service.student.getHistroyItemList(account);
    ctx.body = {
      itemList,
    };
  }
  // 获取学生项目详情
  async getItemDetail() {
    const { ctx } = this;
    // 转化一下item_id值类型为int
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 参数验证
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.request.body);
    const { item_id } = ctx.request.body;
    const itemDetail = await ctx.service.student.getItemDetail(item_id);
    ctx.body = {
      itemDetail,
    };
  }
  // 获取某个项目的所有教师申请表
  async getTeacherFormList() {
    const { ctx, app } = this;
    // TODO:是否需要增加对是不是发布者的判断。
    // 转化一下item_id和teacher_id值类型为int
    if (typeof (ctx.request.query.item_id) === 'string') {
      ctx.request.query.item_id = Number(ctx.request.query.item_id);
    }
    // 检验参数
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.request.query);
    const { item_id } = ctx.request.query;
    const data = await ctx.service.student.getTeacherFormList(item_id);
    ctx.body = {
      data,
    };
  }
  // 获取某个教师申请表详情
  async getTeacherFormDetail() {
    const { ctx } = this;
    // 转化一下item_id和teacher_id值类型为int
    if (typeof (ctx.request.query.item_id) === 'string') {
      ctx.request.query.item_id = Number(ctx.request.query.item_id);
    }
    if (typeof (ctx.request.query.teacher_id) === 'string') {
      ctx.request.query.teacher_id = Number(ctx.request.query.teacher_id);
    }
    // 验证参数
    const options = {
      item_id: 'int',
      teacher_id: 'int',
    };
    ctx.validate(options, ctx.request.query);
    const { item_id, teacher_id } = ctx.request.query;
    ctx.body = await ctx.service.student.getTeacherFormDetail(item_id, teacher_id);
  }
  // 学生选择确认家教老师
  async selectTeacher() {
    const { ctx } = this;
    // 转化一下item_id值类型为int
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 如果teacher_id_array是用逗号分割的字符串，将其转化成数组
    if (typeof (ctx.request.body.teacher_id_array) === 'string') {
      ctx.request.body.teacher_id_array = ctx.request.body.teacher_id_array.split(',');
    }
    // 检验参数
    const options = {
      item_id: 'int',
      teacher_id_array: 'array',
    };
    ctx.validate(options, ctx.request.body);
    const { item_id, teacher_id_array } = ctx.request.body;
    const student_id = ctx.session.account;
    const info = {
      item_id,
      teacher_id_array,
      student_id,
    };
    ctx.body = await ctx.service.student.selectTeachers(info);
  }
  // 学生取消确认的老师
  async unselectTeacher() {
    const { ctx } = this;
    // 转化一下item_id值类型为int
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    if (typeof (ctx.query.teacher_id) === 'string') {
      ctx.query.teacher_id = Number(ctx.query.teacher_id);
    }
    const options = {
      item_id: 'int',
      teacher_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id, teacher_id } = ctx.query;
    const account = ctx.session.account;
    const publisher = await ctx.service.student.getItemsInfoFromDb(item_id);
    if (account !== publisher.account) {
      // TODO:增加错误码
      ctx.body = {
        message: '你不是该项目的发起人，不能修改项目信息',
      };
    }
    ctx.body = await ctx.service.student.unselectTeacher(item_id, teacher_id);
  }
  // 学生将项目设置为完成状态
  async finish() {
    const { ctx } = this;
    // 转化一下item_id值类型为int
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    // 验证参数
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id } = ctx.query;
    const student_id = ctx.session.account;
    const publisher = await ctx.service.student.getItemsInfoFromDb(item_id);
    if (student_id !== publisher.account) {
      // TODO:增加错误码
      ctx.body = {
        message: '你不是项目发布者，无法修改修改项目信息',
      };
    }
    ctx.body = await ctx.service.student.finish(item_id, student_id);
  }
  // 学生项目评价
  async evaluate() {
    const { ctx } = this;
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 参数验证
    const options = {
      item_id: 'int',
      teacher_id: 'string',
      student_id: 'string',
      score: 'string',
      comment: 'string',
      is_anonymous: 'string?',
    };
    ctx.validate(options, ctx.request.body);
    const { item_id, teacher_id, student_id, score, comment, is_anonymous } = ctx.request.body;
    // 检查分数是否在0~100之间
    if (score <= 0 && score >= 100) {
      // TODO: 报错
      console.log('分数不符合规范');
    }
    const account = ctx.session.account;
    // 检查评价人是否是项目的参与者
    if (account !== student_id) {
      // TODO: 抛出错误
      console.log('你不是项目参与者，不能评价该项目');
    }
    const result = await ctx.service.student.getTransactionInfoFromDb(item_id, student_id, teacher_id);
    if (!result || result.dataValues.evaluated === true) {
      // TODO: 抛出错误
      console.log('你没有参与这个项目或你已经被评价过了。');
    }
    const Info = {
      item_id,
      teacher_id,
      student_id,
      score,
      comment,
      is_anonymous,
    };
    ctx.body = await ctx.service.student.evaluate(Info);
  }
  // 学生修改评价内容
  async modifyEvaluate() {
    const { ctx } = this;
    if (typeof (ctx.request.body.item_id) === 'string') {
      ctx.request.body.item_id = Number(ctx.request.body.item_id);
    }
    // 参数验证
    const options = {
      item_id: 'int',
      teacher_id: 'string',
      student_id: 'string',
      score: 'string',
      comment: 'string',
      is_anonymous: 'string?',
    };
    ctx.validate(options, ctx.request.body);
    const { item_id, teacher_id, student_id, score, comment, is_anonymous } = ctx.request.body;
    // 检查分数是否在0~100之间
    if (score <= 0 && score >= 100) {
      // TODO: 报错
      console.log('分数不符合规范');
    }
    const account = ctx.session.account;
    // 检查评价人是否是项目的参与者
    if (account !== student_id) {
      // TODO: 抛出错误
      console.log('你不是项目参与者，不能评价该项目');
    }
    const Info = {
      item_id,
      teacher_id,
      student_id,
      score,
      comment,
      is_anonymous,
    };
    ctx.body = await ctx.service.student.modifyEvaluate(Info);
  }
  // 获取某个学生项目的所有评论信息
  async getItemEvaluate() {
    const { ctx } = this;
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id } = ctx.query;
    const data = await ctx.service.student.getItemEvaluate(item_id);
    ctx.body = {
      data,
    };
  }
  // 收藏学生项目
  async collect() {
    const { ctx } = this;
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id } = ctx.query;
    const account = ctx.session.account;
    ctx.body = await ctx.service.student.collect(item_id, account);
  }
  // 取消收藏学生项目
  async cancelCollect() {
    const { ctx } = this;
    if (typeof (ctx.query.item_id) === 'string') {
      ctx.query.item_id = Number(ctx.query.item_id);
    }
    const options = {
      item_id: 'int',
    };
    ctx.validate(options, ctx.query);
    const { item_id } = ctx.query;
    const account = ctx.session.account;
    ctx.body = await ctx.service.student.cancelCollect(item_id, account);
  }
  // 获取某个学生学生项目收藏列表
  async getCollectionList() {
    const { ctx } = this;
    const account = ctx.session.account;
    const data = await ctx.service.student.getCollectionList(account);
    ctx.body = {
      data,
    };
  }
}


module.exports = StudentController;
