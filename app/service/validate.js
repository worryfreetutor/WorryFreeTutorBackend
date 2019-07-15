'use strict';

const Service = require('egg').Service;
const userErrCode = require('../../config/errCode').userErrCode;

class ValidateService extends Service {
  /**
   * 通过stu微信登录接口进行学生账号验证
   * @param stu_account
   * @param stu_passaword
   * @returns boolean
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

  /**
   * 验证学生用户
   */
  async validateStudent(account, stu_account, stu_password) {
    const { ctx } = this;
    let stu_user;
    try {
      stu_user = await ctx.model.Validation.findOne({
        attributes: [ 'stu_account' ],
        where: {
          stu_account,
        },
      });
    } catch (err) {
      throw ctx.helper.createError(`[service/user.js 验证学生用户>>查找验证用户是否已存在] ${err.toString()}`);
    }
    // 若验证的账号已在数据库中存在，无法通过验证
    if (stu_user) {
      throw ctx.helper.createError('该stu账号已被验证', userErrCode.isValidate.stuAccountExist);
    }
    const is_stu_user = await this.stuAccountValidate(stu_account, stu_password);
    // stu账号密码验证不正确，无法通过验证
    if (!is_stu_user) {
      throw ctx.helper.createError('stu账号密码错误', userErrCode.isValidate.stuValidateFail);
    }
    // 成功通过验证，更新数据库
    try {
      // TODO 改为事务
      await ctx.model.Validation.create({
        account,
        authentication: 'STU',
        stu_account,
      });
      await ctx.model.User.update({
        is_student: true,
      }, {
        where: {
          account,
        },
      });
    } catch (err) {
      throw ctx.helper.createError(`[service/user.js 验证学生用户>>添加更新记录] ${err.toString()}`);
    }
    return {
      message: '成功通过验证',
    };
  }
}

module.exports = ValidateService;
