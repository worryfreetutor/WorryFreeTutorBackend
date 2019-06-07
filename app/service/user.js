'use strict';

const Service = require('egg').Service;
const errCode = require('../../config/errCode');

class UserService extends Service {
  async registry(account, password) {
    const { ctx, config } = this;
    try {
      const user = await ctx.model.User.findOne({
        where: { account },
      });
      // 该账号已注册过
      if (user) {
        // TODO 错误码
        throw ctx.helper.createError('该账号已被注册', errCode.User.registryAccountExisted);
      }
      await ctx.model.User.create({
        account,
        password: ctx.helper.encrypt(password, config.userEncryptKey),
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw new Error(err);
    }
    return {
      message: '注册成功',
    }
  }
}

module.exports = UserService;
