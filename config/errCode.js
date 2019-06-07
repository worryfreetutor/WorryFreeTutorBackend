'use strict';

const errCode = {
  UnknownErr: '100000',
  User: {
    registryAccountParamErr: '010001',
    registryRepassDiff: '010002',
    registryAccountExisted: '010003',
  },
};

module.exports = errCode;
