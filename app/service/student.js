'use strict';

const Service = require('egg').Service;
const stuItemErrCode = require('../../config/errCode').stuItemErrCode;
class StudentService extends Service {
  // 学生发布项目找老师
  async publish(itemInfo) {
    const { ctx } = this;
    // 将项目的发布人性别和性别要求化为大写
    itemInfo.sex = itemInfo.sex.toUpperCase();
    itemInfo.sex_demand = itemInfo.sex_demand.toUpperCase();
    const { account, sex, location, grade, tutorial, free_time, compensation, stu_situation, sex_demand, other_demand, expire_date } = itemInfo;
    try {
      await ctx.model.StudentItems.create({
        account,
        sex,
        location,
        grade,
        tutorial,
        free_time,
        compensation,
        stu_situation,
        sex_demand,
        other_demand,
        expire_date,
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/插入项目 未知错误 ${err.toString()}`);
    }
    return {
      message: '发布成功',
    };
  }
  // 学生修改已经发布的项目
  async modifyItems(itemInfo) {
    const { ctx } = this;
    const { item_id, account, sex, location, grade, tutorial, free_time, compensation, stu_situation, sex_demand, other_demand, expire_date } = itemInfo;
    // 验证修改者是否是项目的发布者
    const publisher = await ctx.model.StudentItems.findOne({
      attributes: [ 'account' ],
      where: {
        item_id,
      },
    });
    if (publisher.dataValues.account !== account) {
      throw ctx.helper.createError('您不是该项目的发布者', stuItemErrCode.studentItem.notItemAuthor);
    }
    // 更新项目信息
    try {
      await ctx.model.StudentItems.update({
        sex,
        location,
        grade,
        tutorial,
        free_time,
        compensation,
        stu_situation,
        sex_demand,
        other_demand,
        expire_date,
      }, { where: { item_id } });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/modifyItems 修改项目信息未知错误 ${err.toString()}`);
    }
    return {
      message: '修改成功',
    };
  }
  // 删除学生项目
  async deleteItems(item_id) {
    const { ctx } = this;
    try {
      await ctx.model.StudentItems.destroy({
        where: {
          item_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/deleteItems 删除项目未知错误 ${err.toString()}`);
    }
    return {
      message: '删除成功',
    };
  }
  // 获取学生项目列表
  async getItemList() {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentItems.findAll({
        attributes: [ 'item_id', 'tutorial', 'compensation', 'applicants_num', 'location', 'sex_demand', 'created_at' ],
        where: {
          status: 'ONGOING',
          deleted_at: null,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getItemList 获取学生列表未知错误 ${err.toString()}`);
    }
    return result;
  }
  // 获取学生历史项目列表
  async getHistroyItemList(account) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentItems.findOne({
        attributes: [ 'item_id', 'tutorial', 'compensation', 'applicants_num', 'location', 'sex_demand', 'status', 'created_at', 'deleted_at' ],
        where: {
          account,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getHistroyItemList 获取学生列表未知错误 ${err.toString()}`);
    }
    return result;
  }
  // 获取学生项目详情
  async getItemDetail(item_id) {
    const { ctx } = this;
    let result;
    try {
      result = ctx.model.StudentItems.findOne({
        where: item_id,
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getItemDetail 获取学生项目详情未知错误${err.toString()}`);
    }
    return result;
  }
  // 获取某个项目的老师申请表列表
  async getTeacherFormList(item_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.TeacherRegistrationForm.findAll({
        attributes: [ 'item_id', 'teacher_id' ],
        where: {
          item_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getTeacherFormList 获取项目教师申请表列表未知错误${err.toString()}`);
    }
    return result;
  }
  // 获取某个老师申请表详情
  async getTeacherFormDetail(item_id, teacher_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.TeacherRegistrationForm.findOne({
        where: {
          item_id,
          teacher_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getTeacherFormDetail 获取老师申请表详情未知错误${err.toString()}`);
    }
    return result.dataValues;
  }
  // 学生选择确定家教老师
  async selectTeachers(info) {
    const { ctx, app } = this;
    const Op = app.Sequelize.Op;
    const { item_id, teacher_id_array} = info;
    try {
      await ctx.model.TeacherRegistrationForm.update({ is_choosed: true }, {
        where: {
          item_id,
          teacher_id: {
            [Op.or]: teacher_id_array,
          },
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/selectTeachers 更新教师申请表未知错误 ${err.toString()}`);
    }
    // 构建批量插入的record
    // const record = [];
    // teacher_id_array.forEach(elem => {
    //   const temp = {
    //     item_id,
    //     teacher_id: elem,
    //     student_id,
    //   };
    //   record.push(temp);
    // });
    // try {
    //   await ctx.model.StudentTransaction.bulkCreate(record);
    // } catch (err) {
    //   ctx.logger.warn(err);
    //   throw ctx.helper.createError('service/student/selectTeachers 批量插入学生交易表未知错误');
    // }
    return {
      message: '成功',
    };

  }
  // 学生取消已选择老师
  async unselectTeacher(item_id, teacher_id) {
    const { ctx } = this;
    try {
      await ctx.model.TeacherRegistrationForm.update({
        is_choosed: 'false',
      }, { where: { item_id, teacher_id } });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/unselectTeacher 取消已选择老师未知错误${err.toString()}`);
    }
    return {
      message: '修改成功',
    };
  }
  // 学生设置项目状态为完成
  async finish(item_id, student_id) {
    const { ctx } = this;
    try {
      await ctx.model.StudentItems.update({
        status: 'SUCCESS',
      }, { where: { item_id } });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/finish 设置项目为完成状态未知错误${err.toString()}`);
    }
    // 将选中的老师记录插入交易表
    await this.insertTransactionTable(item_id, student_id);
    return {
      message: '设置成功',
    };
  }
  // 学生评价项目
  async evaluate(Info) {
    const { ctx } = this;
    const { item_id, teacher_id, student_id, score, comment, is_anonymous } = Info;
    try {
      await ctx.model.StudentEvaluationForm.create({
        item_id,
        teacher_id,
        student_id,
        score,
        comment,
        is_anonymous: is_anonymous ? is_anonymous : false,
      });
      await ctx.model.StudentTransaction.update({
        evaluated: true,
      }, { where: { item_id, teacher_id, student_id } });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/evaluate 评价项目未知错误 ${err.toString()}`);
    }
    // 修改老师评分和评价
    await this.calAveScore(teacher_id, score);
    return {
      message: '评价成功',
    };
  }
  // 学生修改评价内容
  async modifyEvaluate(Info) {
    const { ctx } = this;
    const { item_id, teacher_id, student_id, score, comment, is_anonymous } = Info;
    let oldScore;
    let newScore;
    try {
      // 获取旧的评分
      const StudentEvaluationForm = await ctx.model.StudentEvaluationForm.findOne({
        where: {
          item_id,
          teacher_id,
          student_id,
        },
      });
      oldScore = StudentEvaluationForm.dataValues.score;
      newScore = score;
      // 更新新的信息
      await StudentEvaluationForm.update({
        score,
        comment,
        is_anonymous: is_anonymous ? is_anonymous : false,
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/evaluate 评价项目未知错误${err.toString()}`);
    }
    await this.reCalAveScore(teacher_id, oldScore, newScore);
    return {
      message: '修改评价成功',
    };
  }
  // 获取学生项目的所有评论信息
  async getItemEvaluate(item_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentEvaluationForm.findAll({
        where: {
          item_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getItemEvaluate 获取项目评价信息未知错误 ${err.toString()}`);
    }
    return result;
  }
  // 收藏学生项目
  async collect(item_id, account) {
    const { ctx } = this;
    try {
      await ctx.model.StudentItemsCollection.create({
        item_id,
        account,
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/collect 收藏学生项目未知错误 ${err.toString()}`);
    }
    return {
      message: '收藏成功',
    };
  }
  // 取消收藏学生项目
  async cancelCollect(item_id, account) {
    const { ctx } = this;
    try {
      await ctx.model.StudentItemsCollection.destroy({
        where: {
          item_id,
          account,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/cancelCollect 取消收藏学生项目未知错误 ${err.toString()}`);
    }
    return {
      message: '取消收藏成功',
    };
  }
  // 获取学生项目收藏列表
  async getCollectionList(account) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentItemsCollection.findAll({
        where: {
          account,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getCollectionList 获取收藏学生项目列表未知错误${err.toString()}`);
    }
    return result;
  }

  // service工具函数
  // 根据项目id获取学生发布者id
  async getItemsInfoFromDb(item_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentItems.findOne({
        where: {
          item_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getItemsInfoFromDb 根据项目id获取项目信息未知错误${err.toString()}`);
    }
    return result.dataValues;
  }
  // 修改评分后重新计算老师平均评分
  async reCalAveScore(teacher_id, oldScore, newScore) {
    const { ctx } = this;
    try {
      const User = await ctx.model.User.findOne({
        where: {
          account: teacher_id,
        },
      });
      const { student_num, average_score = 0 } = User.dataValues;
      await User.update({
        average_score: Math.round((average_score * student_num - oldScore + newScore) / student_num),
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/reCalAveScore 重新修改老师评分和学生人数未知错误 ${err.toString()}`);
    }
  }
  // 根据评分计算老师平均评分
  async calAveScore(teacher_id, score) {
    const { ctx } = this;
    try {
      const User = await ctx.model.User.findOne({
        where: {
          account: teacher_id,
        },
      });
      const { student_num, average_score = 0 } = User.dataValues;
      await User.update({
        average_score: Math.round((average_score * student_num + score) / (student_num + 1)),
        student_num: student_num + 1,
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/calAveScore 修改老师评分和学生人数未知错误 ${err.toString()}`);
    }
  }
  // 将选中的老师记录插入交易表
  async insertTransactionTable(item_id, student_id) {
    const { ctx } = this;
    try {
      const result = await ctx.model.TeacherRegistrationForm.findAll({
        attributes: [ 'teacher_id' ],
        where: {
          item_id,
          is_choosed: true,
        },
      });
      const record = [];
      const teacher_id_array = result;
      teacher_id_array.forEach(elem => {
        const temp = {
          item_id,
          teacher_id: elem.dataValues.teacher_id,
          student_id,
        };
        record.push(temp);
      });
      await ctx.model.StudentTransaction.bulkCreate(record);
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/insertTransactionTable 将选中的老师记录插入交易表未知错误${err.toString()}`);
    }
  }
  // 获取交易表特定信息
  async getTransactionInfoFromDb(item_id, student_id, teacher_id) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.StudentTransaction.findOne({
        where: {
          item_id,
          student_id,
          teacher_id,
        },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`service/student/getTransactionInfoFromDb 获取交易表特定信息未知错误${err.toString()}`);
    }
    return result;
  }
}


module.exports = StudentService;
