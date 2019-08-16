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
  async updateUserInfo(account, options) {
    const { ctx } = this;
    const fieldList = [ 'nickname', 'sex', 'per_signature' ];
    options = ctx.helper.objFilter(options, fieldList);
    if (options.sex) options.sex = options.sex.toUpperCase();
    if (JSON.stringify(options) === '{}') {
      // throw ctx.helper.createError('无更新项', userErrCode.updateInfo.noUpdateItem);
      return '更新成功';
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
    return '更新成功';
  }

  //
  /**
   * 获取用户信息
   */
  async getUserInfo(account, scope = 'getInfo') {
    const { ctx } = this;
    let userInfo;
    try {
      userInfo = await ctx.model.User.scope(scope).findOne({
        where: { account },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`[service/user.js 获取用户信息] ${err.toString()}`);
    }
    return userInfo;
  }

  // 将account对应的记录的field列增加num
  async _addFieldByNum(account, field, num) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({
        where: { account },
      });
      if (user) {
        await user.increment(field, {
          by: num,
        });
      }
    } catch (e) {
      ctx.log.warn(e);
      throw ctx.helper.createError(`[service/user.js _addFieldByNum] 未知错误 ${e.toString()}`);
    }
  }

  // 将user的tutor_num项加一
  async addTutorNum(account) {
    await this._addFieldByNum(account, 'tutor_num', 1);
  }

  //
  async addStudentNum(account, num) {
    await this._addFieldByNum(account, 'student_num', num);
  }

  // 计算average_score
  async calAveScore(account, score) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({
        where: {
          account,
        },
      });
      const { student_num, average_score = 0 } = user.dataValues;
      await user.update({
        average_score: Math.round((average_score * student_num + score) / (student_num + 1)),
        student_num: student_num + 1,
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/user.js calAveScore] ${e.toString()}`);
    }
  }
}

module.exports = UserService;
