'use strict';

const crypto = require('crypto');

// 加密函数
const encrypt = (data, key) => {
  const cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

// 解密函数
const decrypt = (encrypted, key) => {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// 过滤掉obj中不属于arr或者空值的属性
const objFilter = (obj, arr) => {
  for (const key in obj) {
    if (!arr.includes(key) || !obj[key]) delete obj[key];
  }
  return obj;
};

// 继承Error类
// UnknownError类
function UnknownError(message) {
  this.name = 'Unknown Error';
  this.message = `[${this.name}] ${message}`;
  this.stack = (new Error()).stack;
  this.code = '1000000';
}
UnknownError.prototype = Object.create(Error.prototype);
UnknownError.prototype.constructor = UnknownError;
// 基础Error类
// function BaseError() {
// //  TODO
// }
// BaseError.prototype = Object.create(Error.prototype);
// BaseError.prototype.constructor = BaseError;

module.exports = {
  createError(msg, code) {
    let err;
    if (code) {
      err = new Error(msg);
      err.code = code;
    } else {
      err = new UnknownError(msg);
      this.ctx.logger.warn(`${err.message}`);
    }
    return err;
  },
  // 短信验证函数
  // 2为验证码已经过期
  // 1为验证码错误
  // 0为验证成功
  async verificateSMS(phone, num) {
    const { app } = this;
    const redis = app.redis;
    const code = await redis.get(phone);
    if (!code) {
      return 2;
    }
    if (num !== code) {
      return 1;
    }
    return 0;
  },
  encrypt,
  decrypt,
  objFilter,
};
