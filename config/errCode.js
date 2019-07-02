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

const errCode = {
  code: '01',
  a: {
    code: '02',
    b: '03',
    c: '04',
  },
  d: {
    code: '05',
    e: '06',
  },
};

errCodeJoin(errCode);

console.log(errCode.a.b);

// const errCode = {
//   UnknownErr: '100000',
//   User: {
//     registryAccountParamErr: '010001',
//     registryAccountExisted: '010003',
//     loginAccountNoexist: '010004',
//     loginPasswordError: '010005',
//   },
// };
//
// module.exports = errCode;
