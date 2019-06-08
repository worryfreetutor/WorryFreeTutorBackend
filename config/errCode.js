'use strict';

const errCode = {
  UnknownErr: '100000',
  User: {
    registryAccountParamErr: '010001',
    registryRepassDiff: '010002',
    registryAccountExisted: '010003',
    loginAccountNoexist: '010004',
    loginPasswordError: '010005',
  },
};

module.exports = errCode;
