'use strict';
const Service = require('egg').Service;
const errCode = require('../../config/errCode');

class LoginService extends Service {
  async login(account, password) {
    const { app, ctx } = this;
    let user;
    // TODO:
    // 从数据库中查找账号和密码
    // 当用户名不存在的时候需要提示注册
    // 当密码错误则返回密码错误的错误码和信息
    try {
      user = await ctx.model.User.findOne({
        attributes: [ 'account', 'password' ],
        where: { account },
      });
    } catch (err) {
      throw ctx.helper.createError('serviceLogin未知错误');
    }
    if (!user) {
      throw ctx.helper.createError('该用户没有注册', errCode.User.loginAccountNoexist);
    }
    // 判断密码是否与数据库密码一致
    const dbPassword = ctx.helper.decrypt(user.password, app.config.userEncryptKey);
    if (dbPassword !== password) {
      throw ctx.helper.createError('密码错误！', errCode.User.loginPasswordError);
    }
    // 使用jwt创建用户对应token
    const secret = app.config.jwt.secret;
    const payload = {
      name: account,
      type: ' ',
    };
    payload.type = 'access_token';
    const access_token = app.jwt.sign(payload, secret, {
      expiresIn: '1h',
    });
    payload.type = 'refresh_token';
    const refresh_token = app.jwt.sign(payload, secret, {
      expiresIn: '30d',
    });
    return {
      access_token,
      refresh_token,
    };
  }
  /**
   * 从刷新令牌中获取用户信息，并重新生成access_token返回
   * @param refresh_token : 刷新令牌
   * @retrun access_token : 令牌
   */
  async refresh(account) {
    const { app } = this;
    const secret = app.config.jwt.secret;
    // 获取存储用户信息的payload的name
    // const result = await ctx.helper.getPayload(refresh_token);
    // const name = result.name;
    const payload = {
      name: account,
      type: 'access_token',
    };
    const access_token = await app.jwt.sign(payload, secret, {
      expiresIn: '1h',
    });
    return access_token;
  }
}

module.exports = LoginService;
