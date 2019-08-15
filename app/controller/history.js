'use strict';

const Controller = require('egg').Controller;

class HistoryController extends Controller {

  // https://blog.csdn.net/zjw0742/article/details/76861013
  /**
   * 获取历史items GET
   * @return {Promise<void>}
   */
  async getHistoryItems() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    const account = ctx.session.account;
    ctx.body = {
      data: await ctx.model.TeacherItem.findAll({
        where: {
          account,
          status: {
            [Op.ne]: 'ONGOING',
          },
        },
      }),
    };
  }

  /**
   * 获取历史交易 GET
   * @return {Promise<void>}
   */
  async getHistoryTransaction() {
    const { ctx } = this;
    const account = ctx.session.account;
    let as_teacher;
    let as_student;
    try {
      await Promise.all([
        as_teacher = await ctx.model.TeacherTransaction.findAll({
          where: { teacher_id: account },
        }),
        as_student = await ctx.model.TeacherTransaction.findAll({
          where: { student_id: account },
        }),
      ]);
    } catch (e) {
      console.log(e);
    }
    ctx.body = {
      as_teacher,
      as_student,
    };
  }

  /**
   * 获取所有评价 GET
   * @return {Promise<void>}
   */
  async getAllComments() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    const account = ctx.session.account;
    let data;
    try {
      data = await ctx.model.TeaEvaForm.findAll({
        where: {
          [Op.or]: [
            { teacher_id: account },
            { student_id: account },
          ],
        },
      });
    } catch (e) {
      console.log(e);
    }
    ctx.body = {
      data,
    };
  }
}

module.exports = HistoryController;
