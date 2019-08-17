'use strict';
const Service = require('egg').Service;
const { teaItemErrCode } = require('../../config/errCode');
const fieldList = [ 'sex', 'location', 'school', 'grade', 'major', 'good_subject',
  'self_introduction', 'free_time', 'expect_compensation', 'expire_date' ];

class TeacherItemService extends Service {
  // 增
  async create(account, name, options) {
    const { ctx } = this;
    if (!name) throw ctx.helper.createError('[未知错误 service/teacherItem.js] create name不存在');
    let res;
    options = ctx.helper.objFilter(options, fieldList);
    if (options.expire_date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(options.expire_date)) {
        throw ctx.helper.createError('日期参数错误', teaItemErrCode.teacherItem.paramError);
      }
    }
    try {
      res = await ctx.model.TeacherItem.create({
        account, name,
        ...options,
      });
    } catch (e) {
      if (e.name === 'SequelizeValidationError') {
        throw ctx.helper.createError('过期日期必须晚于当前日期', teaItemErrCode.teacherItem.paramError);
      } else {
        ctx.logger.warn(e);
        throw ctx.helper.createError(`[未知错误 service/teacherItem.js create] ${e.toString()}`);
      }
    }
    return res;
  }
  // 改
  async update(item_id, options) {
    const { ctx } = this;
    options = ctx.helper.objFilter(options, fieldList);
    try {
      await ctx.model.TeacherItem.update(options, {
        where: { item_id },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/teacherItem.js update] ${e.toString()}`);
    }
  }
  // 更新状态
  async updateStatus(item_id, status) {
    const { ctx } = this;
    try {
      await ctx.model.TeacherItem.update({
        status,
      }, {
        where: { item_id },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/teacherItem.js updateStatus] ${e.toString()}`);
    }
  }
  // 删
  async delete(item_id) {
    const { ctx } = this;
    try {
      await ctx.model.TeacherItem.destroy({
        where: { item_id },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/teacherItem.js delete] ${e.toString()}`);
    }
  }
  // 查
  async findByItemId(item_id) {
    const { ctx } = this;
    let res;
    try {
      res = await ctx.model.TeacherItem.findOne({
        where: { item_id },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/teacherItem.js findByItemId] ${e.toString()}`);
    }
    // 如果找不到
    if (!res) throw ctx.helper.createError('此item_id不存在，无法操作', teaItemErrCode.teacherItem.itemIdNotFound);
    return res;
  }
  // 验证是否某人发起的项目
  async isItemAuthor(item_id, account) {
    const { ctx } = this;
    const res = await this.findByItemId(item_id);
    if (res.account !== account) throw ctx.helper.createError('非本项目发起者，无法操作', teaItemErrCode.teacherItem.notItemAuthor);
    return res;
  }

}

module.exports = TeacherItemService;
