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
    // const account = '12345678';
    await ctx.service.uploadImg.updateUserAvatar(account);
    ctx.body = '更新成功';
  }

  /**
   * 更新用户密码
   */
  async updateUserPass() {
    const { ctx, config } = this;
    const account = ctx.session.account;
    ctx.validate({
      old_password: 'string?',
      token: 'string?',
      new_password: 'string',
    }, ctx.body);
    const { old_password, token, new_password } = ctx.request.body;
    if (!old_password && !token) {
      throw ctx.helper.createError('没有旧密码或验证凭证', userErrCode.updateInfo.noOldPassToken);
    }
    // old_password验证机制
    if (old_password) {
      let user;
      try {
        user = await ctx.model.User.findOne({
          where: {
            account,
            password: ctx.helper.encrypt(old_password, config.userEncryptKey),
          },
        });
      } catch (e) {
        ctx.logger.warn(e);
        throw ctx.helper.createError(`[controller/user.js 未知错误] ${e.toString()}`);
      }
      if (!user) {
        throw ctx.helper.createError('旧密码错误', userErrCode.updateInfo.oldPassError);
      }
    }
    // token验证
    if (token) {
      const crypto = require('crypto');
      const md5 = crypto.createHash('md5');
      // md5加盐加密
      const result = md5.update(`${account}:${config.jwt.salt}`).digest('hex');
      console.log(result);
      if (token !== result) {
        throw ctx.helper.createError('token验证失败', userErrCode.updateInfo.tokenError);
      }
    }
    // 更新
    await ctx.service.user.updateUserPass(account, new_password);
    ctx.body = '更新成功';
  }
}

module.exports = UserController;
