'use strict';
const userErrCode = require('../../config/errCode').userErrCode;

module.exports = () => {
  return async function errorHandler(ctx, next) {
    ctx.set('Content-Type', 'application/json');
    try {
      await next();
      ctx.status = ctx.status === 404 ? 404 : 200;
      const res = typeof ctx.body === 'string' ? { message: ctx.body } : ctx.body;
      ctx.body = {
        code: '0',
        ...res,
      };
    } catch (err) {
      ctx.status = 200;
      ctx.body = {
        code: err.code !== 'invalid_param' ? err.code : userErrCode.validate.paramsValidateError,
        message: err.message ? err.message : err.toString(),
      };
      // 所有的异常都在 app 上触发一个 error 事件
      ctx.app.emit('error', err, ctx);
    }
  };
};
