'use strict';

// errCode拼接
// obj格式:
// const obj = {code:'01', a:{code:'02',b:'03'} }
const errCodeJoin = obj => {
  for (const item in obj) {
    if (obj.hasOwnProperty(item) && item !== 'code') {
      obj[item] = new Proxy(obj[item], {
        get(target) {
          return `${obj.code}${target.code}${Reflect.get(...arguments)}`;
        },
      });
    }
  }
};

const userErrCode = {
  code: '01',
  auth: {
    code: '00',
  },
  register: {
    code: '01',
    accountMustBeNumber: '01',
    accountExisted: '02',
  },
  login: {
    code: '02',
    accountNoExist: '01',
    passwordError: '02',
  },
};

// **注意**
errCodeJoin(userErrCode);
module.exports = {
  userErrCode,
};
