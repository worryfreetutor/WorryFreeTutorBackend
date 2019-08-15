'use strict';
const Service = require('egg').Service;
const { teaItemErrCode } = require('../../config/errCode');
// 过滤列表
const fieldList = [ 'sex', 'tutorial', 'location', 'free_time', 'stu_situation', 'other_situation' ];

class StuRegFormService extends Service {
  // TODO ...
  // 增
  // 报名
  async create(item_id, student_id, options) {
    const { ctx } = this;
    options = ctx.helper.objFilter(options, fieldList);
    try {
      await ctx.model.StuRegForm.create({
        item_id,
        student_id,
        ...options,
      });
    } catch (e) {
      // 不允许二次报名
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw ctx.helper.createError('已报名过此项目', teaItemErrCode.stuJoinItem.hasJoined);
      } else {
        throw ctx.helper.createError(`[service/stuRegForm.js create] 创建学生报名表记录 未知错误 ${e.toString()}`);
      }
    }
  }
  // 改
  async update(item_id, student_id, options) {
    const { ctx } = this;
    options = ctx.helper.objFilter(options, fieldList);
    try {
      await ctx.model.StuRegForm.update(options, {
        where: {
          item_id,
          student_id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  // 删
  async delete(item_id, student_id) {
    const { ctx } = this;
    try {
      await ctx.model.StuRegForm.destroy({
        where: {
          item_id,
          student_id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  // 查
  async _find(item_id, student_id) {
    const { ctx } = this;
    let res;
    try {
      res = await ctx.model.StuRegForm.findOne({
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

  // 验证是否已经报名过某项目
  async validateIsJoined(item_id, student_id) {
    const { ctx } = this;
    const res = await this._find(item_id, student_id);
    if (!res) throw ctx.helper.createError('未报名此项目，无法操作', teaItemErrCode.stuJoinItem.notJoined);
    return res;
  }

  // 获取报名的人的信息
  async getJoinerById(item_id, raw = false, scope = null) {
    // raw 是否按行 为true时不会使用toJSON
    const { ctx } = this;
    let res;
    try {
      res = await ctx.model.StuRegForm.scope(scope).findAll({
        where: {
          item_id,
        },
        raw,
      });
    } catch (e) {
      console.log(e);
    }
    return res;
  }

  // 改变学生选择状态 即选择/取消某学生
  async changeStuChooseStatus(item_id, student_id, choose = true) {
    const { ctx } = this;
    const res = await this._find(item_id, student_id);
    if (!res) throw ctx.helper.createError('此学生未报名此项目，无法操作', teaItemErrCode.stuJoinItem.notJoined);
    try {
      await ctx.model.StuRegForm.update({
        is_choosed: choose,
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

module.exports = StuRegFormService;
