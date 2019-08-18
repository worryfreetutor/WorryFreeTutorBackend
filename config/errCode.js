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
  code: '03',
  teacherItem: {
    code: '01',
    // noItemIdParam: '00',
    itemIdNotFound: '01',
    notItemAuthor: '02',
    onSuccessStatus: '03',
    onExpiredStatus: '04',
    onOngoingStatus: '05',
    paramError: '06',
    haveJoinerNotCancel: '07',
  },
  stuJoinItem: {
    code: '02',
    notAllowed: '01',
    hasJoined: '02',
    notJoined: '03',
    notJoinersNotSuccess: '04',
  },
  transaction: {
    code: '03',
    notSuccess: '01',
    hadEvaluated: '02',
    notEvaluated: '03',
  },
  teaEvaForm: {
    code: '04',
    scoreParamError: '01',
    scoreRangeError: '02',
  },
  validate: {
    code: '05',
    noValidateStudent: '01',
    noValidateTeacher: '02',
    paramsValidateError: '03',
  },
};
const stuItemErrCode = { // 学生项目相关错误码
  code: '04',
  studentItem: {
    code: '01',
    notItemAuthor: '01', // 没有项目权限，用于防止恶意修改他人项目内
    unableDeleteItem: '02', // 不能删除项目，因为有申请者。
    scoreRangeError: '03', // 评分超出范围
    unableEvaluateItem: '04', // 不是项目参与者|交易不存在。
    hadEvaluatedItem: '05', // 你已经评价过该项目
  },
  teaJoinItem: {
    code: '02',
    notFormAuthor: '01', // 不是申请表发起人
    deleteSuccessItem: '02', // 项目已经完成，不能删除申请表
  },
};

// **注意**
errCodeJoin(userErrCode);
errCodeJoin(validateErrCode);
errCodeJoin(teaItemErrCode);
errCodeJoin(stuItemErrCode);
module.exports = {
  userErrCode,
  teaItemErrCode,
  validateErrCode,
  stuItemErrCode,
};
