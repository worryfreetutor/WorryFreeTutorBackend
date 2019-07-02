'use strict';

const crypto = require('crypto');
const errCode = require('../../config/errCode');

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

// 继承Error类
// UnknownError类
function UnknownError(filename, funcname) {
  this.name = 'Unknown Error';
  this.message = `[${this.name}] 发生在${filename}.js ${funcname}`;
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
    const err = new Error(msg);
    if (code) {
      err.code = code;
    } else {
      err.code = errCode.UnknownErr;
      this.ctx.logger.warn(`未知错误 ${err.message}`);
    }
    return err;
  },
  encrypt,
  decrypt,
};
