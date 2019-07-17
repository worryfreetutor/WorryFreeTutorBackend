'use strict';
// 测试用，待删除

const Controller = require('egg').Controller;

class TestController extends Controller {
  async show() {
    await this.ctx.render('upload.html');
  }
}

module.exports = TestController;
