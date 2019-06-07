'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
      const res = ctx.body;
      ctx.body = {
        code: 0,
        ...res,
      };
    } catch (err) {
      ctx.set('Content-Type', 'application/json');
      const body = {
        code: err.code,
        message: err.message ? err.message : err.toString(),
      };
      ctx.body = JSON.stringify(body);
      ctx.status = 200;
      // 所有的异常都在 app 上触发一个 error 事件
      ctx.app.emit('error', err, ctx);
    }
  };
};
