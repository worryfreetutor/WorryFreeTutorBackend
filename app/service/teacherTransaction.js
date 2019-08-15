'use strict';
const Service = require('egg').Service;
const { teaItemErrCode } = require('../../config/errCode');

class TeacherTransactionService extends Service {
  // 批量增加
  async bulkCreate(arr) {
    const { ctx } = this;
    let res;
    try {
      res = await ctx.model.TeacherTransaction.bulkCreate(arr);
    } catch (e) {
      console.log(e);
    }
    return res;
  }
  // 改
  async setEvaluatedStatus(item_id, student_id, evaluated) {
    const { ctx } = this;
    try {
      await ctx.model.TeacherTransaction.update({
        evaluated,
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
  // 查
  async _find(item_id, student_id) {
    const { ctx } = this;
    let res;
    try {
      res = await ctx.model.TeacherTransaction.findOne({
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
  // 获取验证交易状态
  async getTransactionStatus(item_id, student_id, isValidateSuccess = false, isValidateEvaluated = false, isValidateHadEvaluated = false) {
    const { ctx } = this;
    const res = await this._find(item_id, student_id);
    if (isValidateSuccess && !res) {
      throw ctx.helper.createError('未成功报名项目，无法操作', teaItemErrCode.transaction.notSuccess);
    }
    if (isValidateEvaluated && res.evaluated) {
      throw ctx.helper.createError('已评价过', teaItemErrCode.transaction.hadEvaluated);
    }
    if (isValidateHadEvaluated && !res.evaluated) {
      throw ctx.helper.createError('未评价过，无法操作', teaItemErrCode.transaction.notEvaluated);
    }
    return res;
  }
  // TODO ...
}

module.exports = TeacherTransactionService;
