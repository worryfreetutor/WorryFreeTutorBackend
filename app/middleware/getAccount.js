'use strict';
const userErrCode = require('../../config/errCode').userErrCode;
module.exports = () => {
  /**
   * 从token中获取account(用户手机号），并存进session里面，方面后面对用户的身份确定。
   */
  return async function(ctx, next) {
    let result;
    const app = ctx.app;
    const token = ctx.header.authorization;
    const secret = app.config.jwt.secret;
    try {
      result = await app.jwt.verify(token.split(' ')[1], secret);
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw ctx.helper.createError('token过期', userErrCode.login.tokenExpired);
      }
    }
    ctx.session.account = result.name;
    await next();
  };
};
