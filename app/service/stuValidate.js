'use strict';

const Service = require('egg').Service;

class StuValidateService extends Service {
  /**
   * 通过stu微信登录接口进行学生账号验证
   * @param stu_account
   * @param stu_passaword
   * @return boolean
   */
  async stuAccountValidate(stu_account, stu_passaword) {
    const { ctx } = this;
    const wxLoginUrl = 'http://wechat.stu.edu.cn/wechat/login/login_verify';
    const result = await ctx.curl(wxLoginUrl, {
      method: 'POST',
      data: {
        ldap_account: stu_account,
        ldap_password: stu_passaword,
        btn_ok: '登录',
        source_type: '',
        openid: '',
      },
      dataType: 'json',
    });
    return result.data.indexOf('帐号登陆成功') !== -1;
  }
  // 查看用户是否已经通过学生身份验证
  async isStudent(account) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.User.findOne({
        attribute: [ 'is_student' ],
        where: { account },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`[service/stuValidate.js 验证用户是否具有学生身份] ${err.toString()}`);
    }
    return result.dataValues;
  }
  // 查看用户是否已经通过老师身份验证
  async isTeacher(account) {
    const { ctx } = this;
    let result;
    try {
      result = await ctx.model.User.findOne({
        attribute: [ 'is_teacher' ],
        where: { account },
      });
    } catch (err) {
      ctx.logger.warn(err);
      throw ctx.helper.createError(`[service/stuValidate.js 验证用户是否具有老师身份] ${err.toString()}`);
    }
    return result.dataValues;
  }
}

module.exports = StuValidateService;
