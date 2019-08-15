'use strict';

const Controller = require('egg').Controller;
const { teaItemErrCode } = require('../../config/errCode');

class TeacherController extends Controller {

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
    // TODO 拼接上报名信息
    ctx.body = {
      data: await this._getItemById(ctx),
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
    // 发布项目
    ctx.body = {
      data: await ctx.service.teacherItem.create(account, name, ctx.request.body),
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
    const res = await this._getItemById(ctx, true, ctx.session.account, true);
    const item_id = res.item_id;
    await this._validateSexParam(ctx);
    await ctx.service.teacherItem.update(item_id, ctx.request.body);
    ctx.body = '修改成功';
  }

  /**
   * 教师删除自己的项目 GET
   */
  async deleteItem() {
    const { ctx } = this;
    const res = await this._getItemById(ctx, true, ctx.session.account, true);
    await ctx.service.teacherItem.delete(res.item_id);
    ctx.body = '删除成功';
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

  // TODO ....
  /**
   * 教师设置自己的项目为完成状态 GET
   * @return {Promise<void>}
   */
  async teaSetItemSuccess() {
    const { ctx } = this;
    const account = ctx.session.account;
    const item = await this._getItemById(ctx, true, account, true, true);
    const item_id = item.item_id;
    // TODO 事务
    await ctx.service.teacherItem.updateStatus(item_id, 'SUCCESS');
    // 生成交易表记录
    const joiner = await ctx.service.stuRegForm.getJoinerById(item_id, true, 'choosed');
    joiner.forEach(ele => { ele.teacher_id = account; });
    // console.log(joiner);
    await ctx.service.teacherTransaction.bulkCreate(joiner);
    // 将个人教授数加一，若没有人报名则不算
    await ctx.service.user.addTutorNum(account);
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
      is_anonymous: { type: 'string' },
    }, ctx.request.body);
    // 验证score
    const score = parseInt(ctx.request.body.score);
    // TODO 错误码
    if (!score) throw ctx.createError('score参数不合法', teaItemErrCode.teaEvaForm.scoreParamError);
    if (score < 0 || score > 100) throw ctx.createError('score范围在[0,100]', teaItemErrCode.teaEvaForm.scoreRangeError);
    // 验证通过后
    // TODO 事务
    // 更新评论表
    await ctx.service.teaEvaForm.create(item_id, teacher_id, account, ctx.request.body);
    // 更新交易表是否评论状态
    await ctx.service.teacherTransaction.setEvaluatedStatus(item_id, account, true);
    // 更新用户表平均评分
    await ctx.service.user.calAveScore(teacher_id, score);
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
    ctx.body = '修改成功';
  }

  /**
   * 获取某项目的评论信息 GET
   * @return {Promise<void>}
   */
  async getItemComments() {
    const { ctx } = this;
    const item = await this._getItemById(ctx, false, '', false, true, true);
    const score_rank = ctx.request.query.score_rank || 'all';
    ctx.body = {
      data: await ctx.service.teaEvaForm.findItemComments(item.item_id, `${score_rank}Score`),
    };
  }
}

module.exports = TeacherController;
