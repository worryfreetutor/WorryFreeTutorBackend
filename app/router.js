'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // user部分
  router.post('/user/registry', controller.user.registry);
  router.post('/user/login', controller.user.login);
  router.get('/user/refresh', controller.user.refresh);
};
