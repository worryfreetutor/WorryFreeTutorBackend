'use strict';

// errCode拼接
// obj格式:
// const obj = {code:'01', a:{code:'02',b:'03'} }
const errCodeJoin = obj => {
  for (const item in obj) {
    if (item !== 'code') {
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
    tokenExpired: '03',
  },
  updateInfo: {
    code: '03',
    paramsError: '01',
    // noUpdateItem: '02',
  },
  isValidate: {
    code: '04',
    stuAccountExist: '01',
    stuValidateFail: '02',
    idNumberExist: '03',
    idNumValidateFail: '04',
  },
  uploadAvatar: {
    code: '05',
    uploadFail: '01',
  },
};

const validateErrCode = {
  code: '02',
  is_teacher: {
    code: '01',
    no: '01',
  },
  is_student: {
    code: '02',
    no: '01',
  },
};

const teaItemErrCode = { // 教师项目相关错误码
  code: '04',
  // getItemById: {
  //   code: '01',
  //   NotFound: '01',
  //   notAuthor: '02',
  // },
  // updateItem: {
  //   code: '02',
  //   paramsError: '01',
  // },
  // stuRegForm: {
  //   code: '04',
  //   notAuth: '01',
  // },
  // 以上废弃
  // TODO
  teacherItem: {
    code: '05',
    // noItemIdParam: '00',
    itemIdNotFound: '01',
    notItemAuthor: '02',
    onSuccessStatus: '03',
    onExpiredStatus: '04',
    onOngoingStatus: '05',
    paramError: '06',
  },
  stuJoinItem: {
    code: '06',
    notAllowed: '01',
    hasJoined: '02',
    notJoined: '03',
  },
  transaction: {
    code: '07',
    notSuccess: '01',
    hadEvaluated: '02',
    notEvaluated: '03',
  },
  teaEvaForm: {
    code: '08',
    scoreParamError: '01',
    scoreRangeError: '02',
  },
};

// **注意**
errCodeJoin(userErrCode);
errCodeJoin(validateErrCode);
errCodeJoin(teaItemErrCode);
module.exports = {
  userErrCode,
  teaItemErrCode,
  validateErrCode,
};
