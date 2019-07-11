'use strict';

const Controller = require('egg').Controller;
const userErrCode = require('../../config/errCode').userErrCode;

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    ctx.validate({
      account: {
        type: 'string',
      },
      password: {
        type: 'string',
        min: 6,
      },
    }, ctx.body);
    const { account, password } = ctx.request.body;
    const isPhone = str => /^\d+$/.test(str);
    if (!isPhone(account)) {
      throw ctx.helper.createError('账号必须为有效手机号', userErrCode.register.accountMustBeNumber);
    }
    const res = await ctx.service.user.register(account, password);
    ctx.body = res;
  }
  // 登陆
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
      access_token,
      refresh_token,
    };
  }
  async refresh() {
    const { ctx } = this;
    const refresh_token = ctx.header.authorization;
    const access_token = await ctx.service.login.refresh(refresh_token);
    ctx.body = {
      access_token,
    };
  }
}

module.exports = UserController;
