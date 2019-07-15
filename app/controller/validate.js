'use strict';

const Controller = require('egg').Controller;

class ValidateController extends Controller {
  /**
   * 验证学生身份
   */
  async validateStudent() {
    const { ctx } = this;
    ctx.validate({
      stu_account: 'string',
      stu_password: 'string',
    }, ctx.body);
    const { stu_account, stu_password } = ctx.request.body;
    const account = ctx.session.account;
    ctx.body = await ctx.service.validate.validateStudent(account, stu_account, stu_password);
  }
}

module.exports = ValidateController;
