'use strict';
const Service = require('egg').Service;
const { teaItemErrCode } = require('../../config/errCode');
const fieldList = [ 'sex', 'location', 'school', 'grade', 'major', 'good_subject',
  'self_introduction', 'free_time', 'expect_compensation', 'expire_date' ];

class TeacherItemService extends Service {
  // 增
  async create(account, name, options) {
    const { ctx } = this;
    let res;
    options = ctx.helper.objFilter(options, fieldList);
    if (options.expire_date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(options)) {
        throw ctx.helper.createError('日期参数错误');
      }
    }
    try {
      res = await ctx.model.TeacherItem.create({
        account, name,
        ...options,
      });
    } catch (e) {
      // TODO
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
  // TODO ...
}

module.exports = TeacherItemService;
