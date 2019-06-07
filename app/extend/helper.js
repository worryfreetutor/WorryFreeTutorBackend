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

module.exports = {
  createError(msg, code) {
    const err = new Error(msg);
    if (code) {
      err.code = code;
    } else {
      err.code = this.config.errCode.UnknownErr;
      this.ctx.logger.warn(`未知错误 ${err.message}`);
    }
    return err;
  },
  encrypt,
  decrypt,
};
