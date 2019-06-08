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
  async login() {
    const { ctx } = this;
    // 校验规则
    const option = {
      account: 'string',
      password: 'string',
    };
    // 参数检验
    ctx.validate(option, ctx.request.body);
    const { account, password } = ctx.request.body;
    const { access_token, refresh_token } = await ctx.service.login.login(account, password);
    ctx.body = {
      code: 0,
      access_token,
      refresh_token,
    };
  }
  async refresh() {
    const { ctx } = this;
    const refresh_token = ctx.header.refresh_token;
    const access_token = await ctx.service.login.refresh(refresh_token);
    ctx.body = {
      code: 0,
      access_token,
    };
  }
}

module.exports = UserController;
