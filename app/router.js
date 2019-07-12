'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/', controller.home.index);
  // user部分
  router.post('/user/register', controller.user.register);
  router.post('/user/login', controller.user.login);
  router.get('/user/refresh', middleware.getAccount(), controller.user.refresh);
  // 更新用户信息
  router.post('/user/update', middleware.getAccount(), controller.user.updateInfo);
  // 获取用户具体信息
  router.get('/user/info', middleware.getAccount(), controller.user.getInfo);
};
