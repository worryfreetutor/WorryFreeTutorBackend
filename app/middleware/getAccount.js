'use strict';
module.exports = () => {
  /**
   * 从token中获取acount(用户手机号），并存进session里面，方面后面对用户的身份确定。
   */
  return async function(ctx, next) {
    const app = ctx.app;
    const token = ctx.header.authorization;
    const secret = app.config.jwt.secret;
    const result = await app.jwt.verify(token.split(' ')[1], secret);
    ctx.session.account = result.name;
    await next();
  };
};
