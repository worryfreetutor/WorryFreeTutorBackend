'use strict';

const Controller = require('egg').Controller;

class ValidateController extends Controller {
  /**
   * 验证教师身份（stu账号）
   */
  async validateTeacher() {
    const { ctx } = this;
    ctx.validate({
      stu_account: 'string',
      stu_password: 'string',
    }, ctx.body);
    const { stu_account, stu_password } = ctx.request.body;
    const account = ctx.session.account;
    ctx.body = await ctx.service.validate.validateTeacher(account, stu_account, stu_password);
  }

  /**
   * 验证学生身份（id_number）
   */
  async validateStudent() {
    const { ctx } = this;
    const account = ctx.session.account;
    ctx.validate({
      id_number: 'string',
    }, ctx.request.body);
    const { id_number } = ctx.request.body;
    ctx.body = await ctx.service.validate.validateStudent(account, id_number);
  }
}

module.exports = ValidateController;
