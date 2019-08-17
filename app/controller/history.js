'use strict';

const Controller = require('egg').Controller;

class HistoryController extends Controller {

  /**
   * 获取教师的所有项目列表 GET
   * @return {Promise<void>}
   */
  async getHistoryItems() {
    const { ctx } = this;
    const account = ctx.session.account;
    ctx.body = {
      data: await ctx.model.TeacherItem.findAll({
        attributes: [ 'item_id', 'account', 'name', 'sex', 'good_subject', 'expect_compensation' ],
        where: {
          account,
        },
      }),
    };
  }

  /**
   * 获取所有交易记录 GET
   * @return {Promise<void>}
   */
  async getAllTransaction() {
    const { ctx } = this;
    const account = ctx.session.account;
    let as_teacher;
    let as_student;
    try {
      // TODO 待合并学生项目交易表
      as_teacher = await ctx.model.TeacherTransaction.findAll({
        where: { teacher_id: account },
      });
      as_student = await ctx.model.TeacherTransaction.findAll({
        where: { student_id: account },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 controller/history.js getHistoryTransaction] ${e.toString()}`);
    }
    ctx.body = {
      as_teacher,
      as_student,
    };
  }

  /**
   * 获取所有自己评价的记录 GET
   * @return {Promise<void>}
   */
  async getAllComments() {
    const { ctx } = this;
    const account = ctx.session.account;
    let data;
    try {
      data = await ctx.model.TeaEvaForm.findAll({
        where: {
          student_id: account,
        },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 controller/history.js getAllComments] ${e.toString()}`);
    }
    ctx.body = {
      data,
    };
  }
}

module.exports = HistoryController;
