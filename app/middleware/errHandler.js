'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    ctx.set('Content-Type', 'application/json');
    try {
      await next();
      const res = ctx.body;
      ctx.status = ctx.status === 404 ? 404 : 200;
      ctx.body = {
        code: '0',
        ...res,
      };
    } catch (err) {
      const body = {
        code: err.code,
        message: err.message ? err.message : err.toString(),
      };
      ctx.status = 200;
      ctx.body = JSON.stringify(body);
      // 所有的异常都在 app 上触发一个 error 事件
      ctx.app.emit('error', err, ctx);
    }
  };
};
