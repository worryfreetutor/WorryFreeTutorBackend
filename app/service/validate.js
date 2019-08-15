'use strict';
const request_promise = require('request-promise');
const IDValidator = require('id-validator');

const Service = require('egg').Service;
const { userErrCode, validateErrCode } = require('../../config/errCode');

class ValidateService extends Service {
  /**
   * 通过stu微信登录接口进行学生账号验证并返回用户name
   * @param stu_account
   * @param stu_passaword
   * @return boolean
   */
  async _stuAccountValidate(stu_account, stu_passaword) {
    const { ctx } = this;
    const jar = request_promise.jar();
    const request = request_promise.defaults({ jar });
    const wxLoginUrl = 'http://wechat.stu.edu.cn/wechat/login/login_verify';
    const loginResult = await request({
      method: 'POST',
      url: wxLoginUrl,
      form: {
        ldap_account: stu_account,
        ldap_password: stu_passaword,
        btn_ok: '登录',
        source_type: '',
        openid: '',
      },
    });
    if (loginResult.indexOf('帐号登陆成功') !== -1) {
      const getNameUrl = 'http://wechat.stu.edu.cn/wechat/smartcard/Smartcard_cardbalance';
      const getNameResult = await request({
        method: 'GET',
        url: getNameUrl,
      });
      return getNameResult.match(/尊敬的(\S*):/)[1];
    }
    throw ctx.helper.createError('stu账号密码验证错误', userErrCode.isValidate.stuValidateFail);
  }

  // findOne stu_account || id_num 可选择抛错
  async _find(type, stu_account = '', id_number = '', isThrowError = false) {
    const { ctx } = this;
    let res;
    try {
      if (type === 'stu') {
        res = await ctx.model.Validation.findOne({
          where: { stu_account },
        });
      } else {
        res = await ctx.model.Validation.findOne({
          where: { id_number },
        });
      }
    } catch (e) {
      throw ctx.helper.createError(`[service/validate.js findOne] 未知错误 ${e.toString()}`);
    }
    if (isThrowError && res && type === 'stu') {
      throw ctx.helper.createError('该stu账号已被验证过', userErrCode.isValidate.stuAccountExist);
    }
    if (isThrowError && res && type === 'id_num') {
      throw ctx.helper.createError('该id号码已被验证过', userErrCode.isValidate.idNumberExist);
    }
    return res;
  }

  /**
   * 验证教师身份，通过stu账号
   */
  async validateTeacher(account, stu_account, stu_password) {
    const { ctx } = this;
    // 若验证的stu账号在数据库中存在，则失败
    await this._find('stu', stu_account, '', true);
    // stu账号密码验证不正确，无法通过验证
    const user_name = await this._stuAccountValidate(stu_account, stu_password);
    // 成功通过验证，更新数据库
    try {
      // TODO 改为事务
      // 更新validation表
      await ctx.model.Validation.create({
        account,
        authentication: 'TEA',
        stu_account,
      });
      // 更新user表
      await ctx.model.User.update({
        name: user_name,
        is_teacher: true,
      }, {
        where: { account },
      });
    } catch (e) {
      throw ctx.helper.createError(`[service/user.js 验证学生用户>>添加更新记录] ${e.toString()}`);
    }
    return {
      message: '验证教师身份成功',
    };
  }

  /**
   * 验证学生身份，通过id_number
   */
  async validateStudent(account, id_number) {
    const { ctx } = this;
    await this._find('id_num', '', id_number, true);
    const Validator = new IDValidator();
    if (!Validator.isValid(id_number)) {
      throw ctx.helper.createError('id号验证失败', userErrCode.isValidate.idNumValidateFail);
    }
    // 验证通过，更新数据库
    try {
      // 更新验证表
      await ctx.model.Validation.create({
        account,
        authentication: 'STU',
        id_number,
      });
      // 更新用户表
      await ctx.model.User.update({
        is_student: true,
      }, {
        where: { account },
      });
    } catch (e) {
      throw ctx.helper.createError(`[service/validate.js validateStudent.js] 未知错误 ${e.toString()}`);
    }
    return '验证学生身份成功';
  }

  /**
   * 验证用户是否已验证过教师身份并返回该用户的name
   * @param account
   * @return user name
   */
  async isValidateTeacher(account) {
    const { ctx } = this;
    let user;
    try {
      user = await ctx.model.User.findOne({
        attributes: [ 'name', 'is_teacher' ],
        where: { account },
      });
    } catch (e) {
      throw ctx.helper.createError(`[service/validate.js 获取是否验证教师身份] ${e.toString()}`);
    }
    if (!user.is_teacher) {
      throw ctx.helper.createError('未验证教师身份，无法操作', validateErrCode.is_teacher.no);
    }
    return user.name;
  }

  /**
   * 验证用户是否已验证过学生身份
   */
  async isValidateStudent(account) {
    const { ctx } = this;
    let user;
    try {
      user = await ctx.model.User.findOne({
        attributes: [ 'name', 'is_student' ],
        where: { account },
      });
    } catch (e) {
      throw ctx.helper.createError(`[service/validate.js 获取是否验证学生身份] ${e.toString()}`);
    }
    if (!user.is_student) {
      throw ctx.helper.createError('未验证学生身份，无法操作', validateErrCode.is_student.no);
    }
    return user.name;
  }
}

module.exports = ValidateService;
