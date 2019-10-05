'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  router.get('/', controller.home.index);
  // 发送手机短信验证码
  router.get('/code', controller.sms.sendSms);
  // user部分
  // 注册
  router.post('/user/register', controller.user.register);
  // 登录
  router.post('/user/login', controller.user.login);
  // 刷新凭证(废弃）
  // router.get('/user/refresh', middleware.getAccount(), controller.user.refresh);
  // 更新用户信息
  router.post('/user/update', middleware.getAccount(), controller.user.updateInfo);
  // 更新用户密码
  router.post('/user/update/pw', middleware.getAccount(), controller.user.updateUserPass);
  // 获取用户具体信息(自己的)
  router.get('/user/info', middleware.getAccount(), controller.user.getOwnInfo);
  // 获取其他用户信息
  router.get('/user/info/other', controller.user.getOthersInfo);
  // 验证教师身份（stu账号）
  router.post('/validate/teacher', middleware.getAccount(), controller.validate.validateTeacher);
  // 验证学生身份（id_number）
  router.post('/validate/student', middleware.getAccount(), controller.validate.validateStudent);
  // TODO 判断上传文件格式并限制（另外：文件大小） 需要完善
  router.post('/user/avatar', middleware.getAccount(), controller.user.updateUserAvatar);

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
  // 查看教师项目报名信息（简） 上面api有
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
  // 获取教师的所有项目列表
  router.get('/teacher/items/all', middleware.getAccount(), controller.history.getHistoryItems);
  // 获取所有交易记录
  router.get('/history/transactions', middleware.getAccount(), controller.history.getAllTransaction);
  // 获取所有自己评价的记录
  router.get('/history/comments', middleware.getAccount(), controller.history.getAllComments);

  // 收藏模块
  // 获取项目收藏列表 // TODO 接上学生项目的
  router.get('/collect/list', middleware.getAccount(), controller.collection.getCollectionsList);
  // 收藏某个教师项目
  router.get('/collect/teacher/add', middleware.getAccount(), controller.collection.collectItem);
  // 取消收藏某个教师项目
  router.get('/collect/teacher/cancel', middleware.getAccount(), controller.collection.cancelCollectItem);

  // 搜索
  router.post('/search', controller.search.search);

  // ================================================

  // 学生接口部分

  // 学生发布项目找老师
  router.post('/student/publish', middleware.getAccount(), controller.student.publishItems);
  // 学生修改项目
  router.post('/student/modify', middleware.getAccount(), controller.student.modifyItems);
  // 学生删除项目
  router.get('/student/delete', middleware.getAccount(), controller.student.deleteItems);
  // 获取学生项目列表
  router.get('/student/getItemList', controller.student.getItemList);
  // 获取用户发布的历史项目
  router.get('/student/getHistroyItemList', middleware.getAccount(), controller.student.getHistroyItemList);
  // 获取项目详情
  router.post('/student/getItemDetail', controller.student.getItemDetail);
  // 学生获取某个项目所有申请表
  router.get('/student/getTeacherFormList', controller.student.getTeacherFormList);
  // 学生获取某个老师申请表详情
  router.get('/student/getTeacherForm', controller.student.getTeacherFormDetail);
  // 学生选择老师接口（参数，一个或多个老师id，项目id)
  router.post('/student/select', middleware.getAccount(), controller.student.selectTeacher);
  // 学生取消选择某老师
  router.get('/student/unselect', middleware.getAccount(), controller.student.unselectTeacher);
  // 学生将项目设置为完成状态
  router.get('/student/finish', middleware.getAccount(), controller.student.finish);
  // 学生项目评价
  router.post('/student/evaluate', middleware.getAccount(), controller.student.evaluate);
  // 学生修改评价内容
  router.post('/student/modifyEvaluate', middleware.getAccount(), controller.student.modifyEvaluate);
  // 学生获取某个学生项目的的所有评论信息
  router.get('/student/getItemEvaluate', controller.student.getItemEvaluate);
  // 收藏学生项目
  router.get('/student/collect', middleware.getAccount(), controller.student.collect);
  // 取消收藏学生项目
  router.get('/student/cancelCollect', middleware.getAccount(), controller.student.cancelCollect);
  // 获取某人学生项目收藏列表
  router.get('/student/getCollectionList', middleware.getAccount(), controller.student.getCollectionList);

  // 老师接口部分

  // 老师申请学生项目
  router.post('/teacher/apply', middleware.getAccount(), controller.teacher.applyItems);
  // 老师修改申请表
  router.post('/teacher/modifyApplicationForm', middleware.getAccount(), controller.teacher.modifyApplicationForm);
  // 老师获取申请表列表
  router.get('/teacher/getStudentFormList', middleware.getAccount(), controller.teacher.getStudentFormList);
  // 老师获取申请表详情
  router.get('/teacher/getApplicationFormDetail', controller.teacher.getApplicationFormDetail);
  // 老师删除申请表
  router.get('/teacher/deleteApplicationForm', middleware.getAccount(), controller.teacher.deleteApplicationForm);
};
