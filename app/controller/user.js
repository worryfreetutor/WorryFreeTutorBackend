'use strict';

const Controller = require('egg').Controller;
const userErrCode = require('../../config/errCode').userErrCode;

class UserController extends Controller {
  /**
   * 短信验证码校验函数
   */
  async verificateSMS(ctx, phone, num) {
    const redis = ctx.app.redis;
    const code = await redis.get(phone);
    if (!code) {
      throw ctx.helper.createError('该手机未发送短信或手机短信验证码过期', userErrCode.auth.expiredCode);
    }
    if (num !== code) {
      throw ctx.helper.createError('手机验证码不正确', userErrCode.auth.validateSmsCodeFail);
    }
  }

  // 注册
  async register() {
    const { ctx } = this;
    ctx.validate({
      code: {
        type: 'string', // 手机验证码
      },
      account: {
        type: 'string',
      },
      password: {
        type: 'string',
        min: 6,
      },
    }, ctx.body);
    const { code, account, password } = ctx.request.body
    const isPhone = str => /^\d+$/.test(str);
    if (!isPhone(account)) {
      throw ctx.helper.createError('账号必须为有效手机号', userErrCode.register.accountMustBeNumber);
    }
    // 验证手机验证码
    await this.verificateSMS(ctx, account, code);
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
    const { access_token } = await ctx.service.login.login(account, password);
    ctx.body = {
      access_token,
    };
  }
  // 验证码登陆
  async codeLogin() {
    const { ctx } = this;
    // 校验规则
    const options = {
      phone: 'string',
      code: 'string',
    };
    // 参数检验
    ctx.validate(options, ctx.request.body);
    const { phone, code } = ctx.request.body;
    // 验证验证码
    await this.verificateSMS(ctx, phone, code);
    const access_token = await ctx.service.login.codeLogin(phone);
    ctx.body = {
      access_token,
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
      per_signature: 'string?',
    }, ctx.body);
    const sex = ctx.request.body.sex;
    if (sex && sex !== 'male' && sex !== 'female' && sex !== 'secret') {
      throw ctx.helper.createError('sex必须为male、female、secret之间的某一项', userErrCode.updateInfo.paramsError);
    }
    const account = ctx.session.account;
    ctx.body = await ctx.service.user.updateUserInfo(account, ctx.request.body);
  }

  /**
   * 获取用户自己个人信息
   */
  async getOwnInfo() {
    const { ctx } = this;
    const account = ctx.session.account;
    ctx.body = {
      data: await ctx.service.user.getUserInfo(account, 'getOwnInfo'),
    };
  }

  /**
   * 获取其他人个人信息
   */
  async getOthersInfo() {
    const { ctx } = this;
    ctx.validate({
      account: 'string',
    }, ctx.request.query);
    ctx.body = {
      data: await ctx.service.user.getUserInfo(ctx.request.query.account),
    };
  }

  /**
   * 更新用户头像
   */
  async updateUserAvatar() {
    const { ctx } = this;
    const account = ctx.session.account;
    const avatar = await ctx.service.uploadImg.updateUserAvatar(account);
    console.log(avatar);
    ctx.body = {
      avatar,
      message: '更新成功',
    };
  }

  /**
   * 更新用户密码
   */
  async updateUserPass() {
    const { ctx } = this;
    ctx.validate({
      account: 'string',
      code: 'string',
      new_password: {
        type: 'string',
        min: 6,
      },
    }, ctx.body);
    const { account, code, new_password } = ctx.request.body;
    await this.verificateSMS(ctx, account, code);
    // 更新
    await ctx.service.user.updateUserPass(account, new_password);
    ctx.body = '更新成功';
  }
}

module.exports = UserController;
