'use strict';

const Service = require('egg').Service;

class StuValidateService extends Service {
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
}

module.exports = StuValidateService;
