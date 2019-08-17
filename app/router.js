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

  // 学生接口部分

  // 学生发布项目找老师
  router.post('/student/publish', middleware.getAccount(), controller.student.publishItems);
  // 学生修改项目
  router.post('/student/modify', middleware.getAccount(), controller.student.modifyItems);
  // TODO: 学生删除项目(软删除，其他地方需要改，没有申请人的时候才能删除，有申请人的时候只能将项目直接设置为完成状态)
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

  // TODO: 是否缺了获取历史订单（涉及交易表和项目表）

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
