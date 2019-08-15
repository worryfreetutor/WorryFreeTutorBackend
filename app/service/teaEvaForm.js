'use strict';
const Service = require('egg').Service;

class TeaEvaFormService extends Service {
  // 查
  async find(item_id, student_id) {
    const { ctx } = this;
    let res;
    try {
      res = await ctx.model.TeaEvaForm.findOne({
        where: {
          item_id,
          student_id,
        },
      });
    } catch (e) {
      console.log(e);
    }
    return res;
  }
  // 查找一个item的所有评价
  async findItemComments(item_id, scope = 'all') {
    // scope 用于筛选分数段
    const { ctx } = this;
    const rank = [ 'highScore', 'middleScore', 'lowScore' ];
    scope = rank.includes(scope) ? scope : null;
    let res;
    try {
      res = await ctx.model.TeaEvaForm.scope(scope).findAll({
        where: {
          item_id,
        },
      });
    } catch (e) {
      console.log(e);
    }
    return res;
  }
  // 增
  async create(item_id, teacher_id, student_id, options) {
    const { ctx } = this;
    const fieldList = [ 'score', 'comment', 'is_anonymous' ];
    options = ctx.helper.objFilter(options, fieldList);
    try {
      await ctx.model.TeaEvaForm.create({
        item_id,
        teacher_id,
        student_id,
        ...options,
      });
    } catch (e) {
      console.log(e);
    }
  }
  // 更新comment
  async updateComment(item_id, student_id, comment) {
    const { ctx } = this;
    try {
      await ctx.model.TeaEvaForm.update({
        comment,
      }, {
        where: {
          item_id,
          student_id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = TeaEvaFormService;
