'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
  async search() {
    const { ctx } = this;
    ctx.validate({
      keywords: 'string',
    }, ctx.request.body);
    const keywords = ctx.request.body.keywords;
    ctx.body = {
      data: await ctx.service.search.search(keywords),
    };
  }
}

module.exports = SearchController;
