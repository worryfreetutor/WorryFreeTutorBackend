'use strict';

const Controller = require('egg').Controller;
const Core = require('@alicloud/pop-core');

const { userErrCode } = require('../../config/errCode');

class SmsController extends Controller {
  /**
   * 发送短信验证码
   * @return {Promise<void>}
   */
  async sendSms() {
    const { app, ctx, config } = this;
    ctx.validate({
      phone: 'string',
    }, ctx.request.query);
    const phone = ctx.request.query.phone;
    const { accessKeyId, accessKeySecret, expiredTime } = config.AliSms;
    const client = new Core({
      accessKeyId,
      accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25',
    });
    const code = this.generateCode();
    const params = {
      RegionId: 'cn-hangzhou',
      PhoneNumbers: phone,
      SignName: '无忧家教',
      TemplateCode: 'SMS_166778745',
      TemplateParam: `{'code':'${code}'}`,
    };
    const requestOption = {
      method: 'POST',
    };
    const res = await client.request('SendSms', params, requestOption).then(result => {
      return result;
    }, err => {
      throw ctx.helper.createError(`[发送手机短信验证码 未知错误] ${err.toString()}`);
    });
    if (res.Code === 'OK') {
      // redis短信倒数功能。
      const redis = app.redis;
      await redis.pipeline()
        .set(phone, code)
        .expire(phone, expiredTime)
        .exec();
    } else {
      throw ctx.helper.createError(`[发送手机短信验证码 发送失败] ${res.toString()}`, userErrCode.auth.sendSmsFail);
    }
  }

  /**
   * 生成随机四位数字字符
   * @return {string}
   */
  generateCode() {
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += Math.trunc(Math.random() * 10);
    }
    return res;
  }
}

module.exports = SmsController;
