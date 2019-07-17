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

  /**
   * 完善用户信息
   * 目前用户信息
   * nickname 昵称 string
   * sex 性别 enum { male,female,secret }
   * grade 年级 string
   * intro 自我介绍 string
   * other 待定
   */
  async updateInfo() {
    const { ctx } = this;
    ctx.validate({
      nickname: 'string?',
      sex: 'string?',
      grade: 'string?',
      intro: 'string?',
    }, ctx.body);
    const { nickname, sex, grade, intro } = ctx.request.body;
    if (sex && sex !== 'male' && sex !== 'female' && sex !== 'secret') {
      throw ctx.helper.createError('sex必须为male、female、secret之间的某一项', userErrCode.updateInfo.paramsError);
    }
    const account = ctx.session.account;
    ctx.body = await ctx.service.user.updateUserInfo(account, nickname, sex, grade, intro);
  }

  /**
   * 获取用户信息
   */
  async getInfo() {
    const { ctx } = this;
    const account = ctx.session.account;
    ctx.body = await ctx.service.user.getUserInfo(account);
  }

  /**
   * 更新用户头像
   */
  async updateUserAvatar() {
    const { ctx } = this;
    const account = ctx.session.account;
    // const account = '12345678';
    await ctx.service.uploadImg.updateUserAvatar(account);
    ctx.body = '更新成功';
  }
}

module.exports = UserController;
