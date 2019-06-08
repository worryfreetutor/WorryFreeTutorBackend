'use strict';

const Service = require('egg').Service;
const errCode = require('../../config/errCode');

class UserService extends Service {
  async register(account, password) {
    const { ctx, config } = this;
    let user;
    try {
      user = await ctx.model.User.findOne({
        where: { account },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/user/查找用户 未知错误');
    }
    // 该账号已注册过
    if (user) {
      throw ctx.helper.createError('该账号已被注册', errCode.User.registryAccountExisted);
    }
    try {
      await ctx.model.User.create({
        account,
        password: ctx.helper.encrypt(password, config.userEncryptKey),
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError('service/user/插入新用户 未知错误');
    }
    return {
      message: '注册成功',
    };
  }
}

module.exports = UserService;
