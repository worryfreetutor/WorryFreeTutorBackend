'use strict';
const Service = require('egg').Service;

class SearchService extends Service {
  async search(keywords) {
    const { ctx, app } = this;
    const Op = app.Sequelize.Op;
    // nodejieba分词
    // 数据库模糊查询
  }
}

module.exports = SearchService;
