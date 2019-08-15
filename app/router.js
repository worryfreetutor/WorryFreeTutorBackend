'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/', controller.home.index);
  // user部分
  // 注册
  router.post('/user/register', controller.user.register);
  // 登录
  router.post('/user/login', controller.user.login);
  // 刷新凭证
  router.get('/user/refresh', middleware.getAccount(), controller.user.refresh);
  // 更新用户信息
  router.post('/user/update', middleware.getAccount(), controller.user.updateInfo);
  // 获取用户具体信息(自己的)
  router.get('/user/info', middleware.getAccount(), controller.user.getOwnInfo);
  // 获取其他用户信息
  router.get('/user/info/other', controller.user.getOthersInfo);
  // 验证教师身份（stu账号）
  router.post('/validate/teacher', middleware.getAccount(), controller.validate.validateTeacher);
  // 验证学生身份（id_number）
  router.post('/validate/student', middleware.getAccount(), controller.validate.validateStudent);
  // test
  router.get('/upload/test', controller.test.show); // 待删除
  // TODO 判断上传文件格式并限制（另外：文件大小）
  router.post('/user/updateAvatar', middleware.getAccount(), controller.user.updateUserAvatar);

  // teacher模块
  // 获取teacher项目的列表
  router.get('/teacher/item/list', controller.teacher.getItemList);
  // 获取teacher项目的详情
  router.get('/teacher/item/detail', controller.teacher.getItemDetail);
  // 发布教师项目
  router.post('/teacher/item/publish', middleware.getAccount(), controller.teacher.pubItem);
  // 教师修改自己发布的项目
  router.post('/teacher/item/update', middleware.getAccount(), controller.teacher.updateItem);
  // 教师删除自己发布的项目
  router.get('/teacher/item/delete', middleware.getAccount(), controller.teacher.deleteItem);

  // 学生报名参加教师项目
  router.post('/teacher/item/join', middleware.getAccount(), controller.teacher.stuJoinItem);
  // 学生修改报名表
  router.post('/teacher/item/join/modify', middleware.getAccount(), controller.teacher.stuModifyRegForm);
  // 学生取消报名
  router.get('/teacher/item/join/cancel', middleware.getAccount(), controller.teacher.stuCancelReg);
  // 查看教师项目报名信息（简）
  // 查看教师项目报名信息（详）
  router.get('/teacher/item/join/info', middleware.getAccount(), controller.teacher.getItemJoinInfo);
  // 教师选择某学生
  router.get('/teacher/item/choose/student', middleware.getAccount(), controller.teacher.teaChooseStu);
  // 教师取消选择某学生
  router.get('/teacher/item/cancel/student', middleware.getAccount(), controller.teacher.teaCancelChooseStu);
  // 教师设置项目为成功完成状态
  router.get('/teacher/set/item/success', middleware.getAccount(), controller.teacher.teaSetItemSuccess);
  // 学生评价
  router.post('/teacher/item/comment', middleware.getAccount(), controller.teacher.stuCommentItem);
  // 学生修改评价（评分无法修改）
  router.post('/teacher/item/comment/modify', middleware.getAccount(), controller.teacher.stuModifyComment);
  // 获取某项目所有评价
  router.get('/teacher/item/comments/get', controller.teacher.getItemComments);

  // 历史模块
  // 获取历史items
  router.get('/history/items', middleware.getAccount(), controller.history.getHistoryItems);
  // 获取历史交易
  router.get('/history/transaction', middleware.getAccount(), controller.history.getHistoryTransaction);
  // 获取历史评价
  router.get('/history/comments', middleware.getAccount(), controller.history.getAllComments);

  // 收藏模块
  // 获取收藏列表
  router.get('/collect/list', middleware.getAccount(), controller.collection.getCollectionsList);
  // 收藏某个项目
  router.get('/collect/add', middleware.getAccount(), controller.collection.collectItem);
  // 取消收藏某个项目
  router.get('/collect/cancel', middleware.getAccount(), controller.collection.cancelCollectItem);
};
