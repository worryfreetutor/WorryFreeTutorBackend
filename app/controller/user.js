'use strict';

const Controller = require('egg').Controller;
const errCode = require('../../config/errCode');

class UserController extends Controller {
  // 注册
  async registry() {
    const { ctx } = this;
    ctx.validate({
      account: {
        type: 'string',
      },
      password: {
        type: 'string',
        min: 6,
      },
      repassword: {
        type: 'string',
        min: 6,
      },
    }, ctx.body);
    const { account, password, repassword } = ctx.request.body;
    const isPhone = str => /^\d+$/.test(str);
    if (!isPhone(account)) {
      throw ctx.helper.createError('账号必须为有效手机号', errCode.User.registryAccountParamErr);
    }
    if (password !== repassword) {
      throw ctx.helper.createError('两次输入的密码不一致', errCode.User.registryRepassDiff);
    }
    const res = await ctx.service.user.registry(account, password);
    ctx.body = res;
  }
}

module.exports = UserController;
