'use strict';
const Service = require('egg').Service;
const userErrCode = require('../../config/errCode').userErrCode;

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
      throw ctx.helper.createError('该用户没有注册', userErrCode.login.accountNoExist);
    }
    // 判断密码是否与数据库密码一致
    const dbPassword = ctx.helper.decrypt(user.password, app.config.userEncryptKey);
    if (dbPassword !== password) {
      throw ctx.helper.createError('密码错误！', userErrCode.login.passwordError);
    }
    // 使用jwt创建用户对应token
    const secret = app.config.jwt.secret;
    const payload = {
      name: account,
      type: ' ',
    };
    payload.type = 'access_token';
    const access_token = app.jwt.sign(payload, secret, {
      expiresIn: '30d',
    });
    // payload.type = 'refresh_token';
    // const refresh_token = app.jwt.sign(payload, secret, {
    //   expiresIn: '30d',
    // });
    return {
      access_token,
      // refresh_token,
    };
  }

  // 验证码登陆
  async codeLogin(phone) {
    const { app, ctx } = this;
    const User = ctx.model.User;
    let user;
    try {
      user = await User.findOne({
        where: {
          account: phone,
        },
      });
    } catch (err) {
      throw ctx.helper.createError('查询用户表未知错误', userErrCode.codeLogin.findDBUnknowError);
    }
    // 检查该用户是否已经注册
    if (!user) {
      throw ctx.helper.createError('该用户没有注册', userErrCode.codeLogin.accountNoExist);
    }
    // 使用jwt创建用户对应token
    const secret = app.config.jwt.secret;
    const payload = {
      name: phone,
      type: 'access_token',
    };
    const access_token = app.jwt.sign(payload, secret, {
      expiresIn: '30d',
    });
    return access_token;
  }

  /**
   * 从刷新令牌中获取用户信息，并重新生成access_token返回
   * 
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
      expiresIn: '2h',
    });
    return access_token;
  }
}

module.exports = LoginService;
