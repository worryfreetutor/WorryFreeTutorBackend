'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
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
