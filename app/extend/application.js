// app/extend/application.js
'use strict';

const errCode = require('../../config/errCode');

module.exports = app => {
  app.errCode = errCode;
};
