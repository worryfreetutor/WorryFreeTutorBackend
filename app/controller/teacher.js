'use strict';

const Controller = require('egg').Controller;
const { teaItemErrCode, validateErrCode, stuItemErrCode } = require('../../config/errCode');
const { clone } = require('lodash');

class TeacherController extends Controller {

  // 老师申请学生项目
  async applyItems() {
    const { ctx } = this;
    const account = ctx.session.account;
    // 检查老师是否经过身份验证
    const result = await ctx.service.stuValidate.isTeacher(account);
    if (!result.is_teacher) {
      throw ctx.helper.createError('请先进行老师身份验证', validateErrCode.is_teacher.no);
    }
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
      throw ctx.helper.createError('不是申请表发起人', stuItemErrCode.teaJoinItem.notFormAuthor);
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
    const account = ctx.session.account;
    // 检测用户是否是申请表的发起人
    if (teacher_id !== account) {
      throw ctx.helper.createError('你不是申请表发起人，无法进行删除', stuItemErrCode.teaJoinItem.notFormAuthor);
    }
    // 检查项目是否完成，项目完成，申请表不能删除
    const result = await ctx.service.student.getItemsInfoFromDb(item_id);
    if (result.status === 'SUCCESS') {
      throw ctx.helper.createError('项目已经完成，申请表无法删除', stuItemErrCode.teaJoinItem.notFormAuthor);
    }
    ctx.body = await ctx.service.teacher.deleteApplicationForm(item_id, teacher_id);
  }


  // =====================以上麦总的代码==========================

  /**
   * 获取项目列表 GET
   * @param start 从第几个项目开始
   * @param nums 取项目的数目，即每页的个数
   * @return {Promise<void>}
   */
  async getItemList() {
    const { ctx } = this;
    // 校验参数
    ctx.validate({
      start: 'string?',
      num: 'string?',
    }, ctx.request.query);
    const { start, num } = ctx.request.query;
    // 返回结果
    let result;
    try {
      result = await ctx.model.TeacherItem.scope('itemlist').findAll({
        offset: parseInt(start) || 0,
        limit: parseInt(num) || 10,
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[controller/teacher.js 获取教师项目列表] ${e.toString()}`);
    }
    ctx.body = {
      data: result,
    };
  }

  async _getItemById(ctx, isValidateAuthor = false, account = '', isValidateSuccess = false, isValidateExpired = false, isValidateOngoing = false) {
    // 从GET请求参数中获取item_id
    const item_id = parseInt(ctx.request.query.item_id);
    if (!item_id) throw ctx.helper.createError('item_id参数错误', teaItemErrCode.teacherItem.itemIdNotFound);
    // 是否验证发起者
    const res = isValidateAuthor && account ?
      await ctx.service.teacherItem.isItemAuthor(item_id, account) :
      await ctx.service.teacherItem.findByItemId(item_id);
    // 是否验证项目已经成功
    if (isValidateSuccess && res.status === 'SUCCESS') {
      throw ctx.helper.createError('项目处于成功状态，无法操作', teaItemErrCode.teacherItem.onSuccessStatus);
    }
    // 是否验证项目已经过期
    if (isValidateExpired && res.status === 'EXPIRED') {
      throw ctx.helper.createError('项目已过期，无法操作', teaItemErrCode.teacherItem.onExpiredStatus);
    }
    // 是否验证项目正在进行
    if (isValidateOngoing && res.status === 'ONGOING') {
      throw ctx.helper.createError('项目正在进行中，无法操作', teaItemErrCode.teacherItem.onOngoingStatus);
    }
    return res;
  }

  /**
   * 获取项目详情 GET
   * @return {Promise<void>}
   */
  async getItemDetail() {
    const { ctx } = this;
    const data = {
      info: await this._getItemById(ctx),
      registration: await ctx.model.StuRegForm.scope('simple').findAll({
        where: {
          item_id: ctx.request.query.item_id,
        },
      }),
    };
    ctx.body = {
      data,
    };
  }

  /**
   * 教师发布项目 POST
   * @return {Promise<void>}
   */
  async pubItem() {
    const { ctx } = this;
    // 检验是否有验证身份
    const account = ctx.session.account;
    const name = await ctx.service.validate.isValidateTeacher(account);
    // 验证身份通过，校验参数
    ctx.validate({
      sex: [ 'male', 'female' ], // 性别
      location: { type: 'string' }, // 地址
      school: { type: 'string' }, // 学校
      grade: { type: 'string' }, // 年级
      major: { type: 'string' }, // 专业
      good_subject: { type: 'string' }, // 擅长的科目
      self_introduction: { type: 'string' }, // 自我介绍
      free_time: { type: 'string' }, // 空闲时间
      expect_compensation: { type: 'string' }, // 期望的薪资
      expire_date: { type: 'date?' }, // 过期日期
    }, ctx.body);
    const data = (await ctx.service.teacherItem.create(account, name, ctx.request.body)).dataValues;
    // 同步数据到elasticsearch
    const options = clone(data);
    ctx.service.search.create(options.item_id, options);
    ctx.body = {
      data,
    };
  }

  // 验证性别参数
  async _validateSexParam(ctx) {
    const body = ctx.request.body;
    if (body.sex) {
      if (body.sex !== 'male' && body.sex !== 'female') {
        throw ctx.helper.createError('参数sex错误', teaItemErrCode.teacherItem.paramError);
      }
    }
  }

  /**
   * 教师修改自己的项目 POST
   * @return {Promise<void>}
   */
  async updateItem() {
    const { ctx } = this;
    const res = await this._getItemById(ctx, true, ctx.session.account, true, true);
    const item_id = res.item_id;
    const options = clone(ctx.request.body);
    await this._validateSexParam(ctx);
    await ctx.service.teacherItem.update(item_id, ctx.request.body);
    ctx.service.search.update(item_id, options);
    ctx.body = '修改成功';
  }

  /**
   * 教师删除/取消自己的项目 GET
   */
  async deleteItem() {
    const { ctx } = this;
    const res = await this._getItemById(ctx, true, ctx.session.account, true);
    const item_id = res.item_id;
    // 验证是否有人报名参加
    let joiner;
    try {
      joiner = await ctx.model.StuRegForm.findOne({
        where: { item_id },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 controller/teacher.js deleteItem] ${e.toString()}`);
    }
    if (joiner) throw ctx.helper.createError('此项目已有报名参与者，无法取消', teaItemErrCode.teacherItem.haveJoinerNotCancel);
    await ctx.service.teacherItem.delete(item_id);
    ctx.service.search.delete(item_id);
    ctx.body = '项目取消成功';
  }

  /**
   * 学生报名某项目 POST
   */
  async stuJoinItem() {
    const { ctx } = this;
    const account = ctx.session.account;
    await ctx.service.validate.isValidateStudent(account);
    const item = await this._getItemById(ctx, false, '', true, true);
    if (account === item.account) {
      throw ctx.helper.createError('项目发起人不能报名项目', teaItemErrCode.stuJoinItem.notAllowed);
    }
    // 获取报名表信息
    ctx.validate({
      sex: [ 'male', 'female' ],
      tutorial: { type: 'string' },
      location: { type: 'string' },
      free_time: { type: 'string' },
      stu_situation: { type: 'string?' },
      other_situation: { type: 'string?' },
    }, ctx.request.body);
    await ctx.service.stuRegForm.create(item.item_id, account, ctx.request.body);
    ctx.body = '报名成功';
  }

  /**
   * 学生修改报名表 POST
   * @return {Promise<void>}
   */
  async stuModifyRegForm() {
    const { ctx } = this;
    const item = await this._getItemById(ctx, false, '', true, true);
    const item_id = item.item_id;
    const account = ctx.session.account;
    // 验证是否报过名
    await ctx.service.stuRegForm.validateIsJoined(item_id, account);
    // 验证参数
    ctx.validate({
      sex: { type: 'string?' },
      tutorial: { type: 'string?' },
      location: { type: 'string?' },
      free_time: { type: 'string?' },
      stu_situation: { type: 'string?' },
      other_situation: { type: 'string?' },
    }, ctx.body);
    await this._validateSexParam(ctx);
    await ctx.service.stuRegForm.update(item_id, account, ctx.request.body);
    ctx.body = '修改成功';
  }

  /**
   * 学生取消报名 GET
   * @return {Promise<void>}
   */
  async stuCancelReg() {
    const { ctx } = this;
    // 验证item_id和状态
    const item = await this._getItemById(ctx, false, '', true, false);
    const item_id = item.item_id;
    const account = ctx.session.account;
    // 验证是否报过名
    await ctx.service.stuRegForm.validateIsJoined(item_id, account);
    await ctx.service.stuRegForm.delete(item_id, account);
    ctx.body = '取消成功';
  }

  /**
   * 教师获取自己项目的报名信息 GET
   * @return {Promise<void>}
   */
  async getItemJoinInfo() {
    const { ctx } = this;
    const account = ctx.session.account;
    const item = await this._getItemById(ctx, true, account, true, true);
    const item_id = item.item_id;
    ctx.body = {
      data: await ctx.service.stuRegForm.getJoinerById(item_id),
    };
  }

  // 改变学生选择的状态
  async _changeStuChooseStatus(ctx, choose) {
    ctx.validate({
      item_id: { type: 'string' },
      student_id: { type: 'string' },
    }, ctx.request.query);
    const account = ctx.session.account;
    const item = await this._getItemById(ctx, true, account, true, true);
    const item_id = item.item_id;
    const student_id = ctx.request.query.student_id;
    await ctx.service.stuRegForm.changeStuChooseStatus(item_id, student_id, choose);
  }

  /**
   * 教师选择某学生 GET
   * @return {Promise<void>}
   */
  async teaChooseStu() {
    const { ctx } = this;
    await this._changeStuChooseStatus(ctx, true);
    ctx.body = '选择成功';
  }

  /**
   * 教师取消选择某学生 GET
   * @return {Promise<void>}
   */
  async teaCancelChooseStu() {
    const { ctx } = this;
    await this._changeStuChooseStatus(ctx, false);
    ctx.body = '取消成功';
  }

  /**
   * 教师设置自己的项目为完成状态 GET
   * @return {Promise<void>}
   */
  async teaSetItemSuccess() {
    const { ctx } = this;
    const account = ctx.session.account;
    const item = await this._getItemById(ctx, true, account, true, true);
    const item_id = item.item_id;
    // 生成交易表记录
    const joiner = await ctx.service.stuRegForm.getJoinerById(item_id, true, 'choosed');
    if (joiner === []) throw ctx.helper.createError('无人参加此项目，无法设置成功状态，可取消该项目', teaItemErrCode.stuJoinItem.notJoinersNotSuccess);
    joiner.forEach(ele => { ele.teacher_id = account; });
    // console.log(joiner);
    // TODO 事务
    await Promise.all([
      // 更新项目记录状态
      ctx.service.teacherItem.updateStatus(item_id, 'SUCCESS'),
      // 根据joiner创建交易表
      ctx.service.teacherTransaction.bulkCreate(joiner),
      // 将个人教授数加一
      ctx.service.user.addTutorNum(account),
    ]);
    ctx.body = '设置完成状态成功';
  }

  /**
   * 学生评价某项目 POST
   * @return {Promise<void>}
   */
  async stuCommentItem() {
    const { ctx } = this;
    const account = ctx.session.account;
    const item = await this._getItemById(ctx, false, '', false, true, true);
    const item_id = item.item_id;
    // 验证是否在交易表中
    const transaction = await ctx.service.teacherTransaction.getTransactionStatus(item_id, account, true, true, false);
    const teacher_id = transaction.teacher_id;
    ctx.validate({
      score: { type: 'string' },
      comment: { type: 'string' },
      is_anonymous: [ '0', '1' ],
    }, ctx.request.body);
    // TODO 验证score
    const score = parseInt(ctx.request.body.score);
    if (!score) throw ctx.createError('score参数不合法', teaItemErrCode.teaEvaForm.scoreParamError);
    if (score < 0 || score > 100) throw ctx.createError('score范围在[0,100]', teaItemErrCode.teaEvaForm.scoreRangeError);
    // 验证通过后
    // TODO 事务
    await Promise.all([
      // 更新评论表
      ctx.service.teaEvaForm.create(item_id, teacher_id, account, ctx.request.body),
      // 更新交易表是否评论状态
      ctx.service.teacherTransaction.setEvaluatedStatus(item_id, account, true),
      // 更新用户表平均评分
      ctx.service.user.calAveScore(teacher_id, score),
    ]);
    ctx.body = '评价成功';
  }

  /**
   * 学生修改评论 POST
   * @return {Promise<void>}
   */
  async stuModifyComment() {
    const { ctx } = this;
    const item = await this._getItemById(ctx, false, '', false, true, true);
    const item_id = item.item_id;
    const account = ctx.session.account;
    await ctx.service.teacherTransaction.getTransactionStatus(item_id, account, true, false, true);
    ctx.validate({
      comment: { type: 'string' },
    }, ctx.request.body);
    await ctx.service.teaEvaForm.updateComment(item_id, account, ctx.request.body.comment);
    ctx.body = '修改评价内容成功';
  }

  /**
   * 获取某项目的评论信息 GET
   * @return {Promise<void>}
   */
  async getItemComments() {
    const { ctx } = this;
    const item = await this._getItemById(ctx, false, '', false, true, true);
    // TODO 高低分段设置
    const score_rank = ctx.request.query.score_rank;
    ctx.body = {
      data: await ctx.service.teaEvaForm.findItemComments(item.item_id, score_rank),
    };
  }

}

module.exports = TeacherController;
