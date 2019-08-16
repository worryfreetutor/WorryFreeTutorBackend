'use strict';
const Service = require('egg').Service;
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://192.168.126.128:9200' });

class SearchService extends Service {
  async search(keywords) {
    const { ctx, app } = this;

    // 使用elasticsearch进行中文搜索
    const result = await client.search({
      index: 'item',
      type: 'teacher',
      // analyzer: 'ik_smart',
      // from: 0, // Starting offset (default: 0)
      _source: '',
      body: {
        query: {
          multi_match: {
            query: keywords,
            fields: [ 'location', 'major', 'free_time' ],
          },
        },
      },
    });
    if (result.statusCode !== 200) return [];

    // 提取item_id列表
    const hits = result.body.hits.hits;
    const idArray = [];
    hits.forEach(hit => {
      idArray.push(hit._id);
    });
    if (idArray.length === 0) return [];

    const Op = app.Sequelize.Op;
    const itemList = await ctx.model.TeacherItem.scope('itemlist').findAll({
      where: {
        item_id: {
          [Op.in]: idArray,
        },
      },
    });
    return itemList;
    // TODO mysql和elasticsearch数据同步
  }
}

module.exports = SearchService;
