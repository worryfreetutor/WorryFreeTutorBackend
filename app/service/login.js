'use strict';
const Service = require('egg').Service;

class LoginService extends Service {
  async login(account, password) {
    const { app } = this;
    // TODO:
    // 从数据库中查找账号和密码
    // 当用户名不存在的时候需要提示注册
    // 当密码错误则返回密码错误的错误码和信息
    if (account === '123' && !password === '123') {
      console.log('登陆成功');
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
  async refresh(refresh_token) {
    const { app, ctx } = this;
    const secret = app.config.jwt.secret;
    // 获取存储用户信息的payload的name
    const result = await ctx.helper.getPayload(refresh_token);
    const name = result.name;
    const payload = {
      name,
      type: 'access_token',
    };
    console.log(payload);
    const access_token = await app.jwt.sign(payload, secret, {
      expiresIn: '1h',
    });
    // console.log(access_token);
    return access_token;
  }
}

module.exports = LoginService;
