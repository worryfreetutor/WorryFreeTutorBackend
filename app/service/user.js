'use strict';

const Service = require('egg').Service;
const userErrCode = require('../../config/errCode').userErrCode;

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
      throw ctx.helper.createError('该账号已被注册', userErrCode.register.accountExisted);
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

  /**
   * 更新用户信息
   */
  async updateUserInfo(account, nickname, sex, grade, intro) {
    const { ctx } = this;
    // 将sex转换为大写
    if (sex) {
      sex = sex.toUpperCase();
    }
    const options = {
      nickname,
      sex,
      grade,
      intro,
    };
    for (const index in options) {
      if (!options[index]) {
        delete options[index];
      }
    }
    if (JSON.stringify(options) === '{}') {
      throw ctx.helper.createError('无更新项', userErrCode.updateInfo.noUpdateItem);
    }
    try {
      await ctx.model.User.update(options, {
        where: {
          account,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`[service/user.js 更新用户] ${err.toString()}`);
    }
    return {
      message: '更新成功',
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(account) {
    const { ctx } = this;
    let userInfo;
    try {
      userInfo = await ctx.model.User.findOne({
        attributes: [ 'account', 'nickname', 'avatar', 'sex', 'grade', 'intro', 'is_teacher', 'is_student' ],
        where: { account },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`[service/user.js 获取用户信息] ${err.toString()}`);
    }
    const data = userInfo.dataValues;
    return {
      data,
    };
  }
}

module.exports = UserService;
