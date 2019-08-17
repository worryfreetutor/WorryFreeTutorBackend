'use strict';
const Service = require('egg').Service;
const moment = require('moment');
const { Client } = require('@elastic/elasticsearch');
// TODO 写到config
const esNodeUrl = 'http://192.168.126.128:9200';
const client = new Client({ node: esNodeUrl });
const esIndex = 'item';
const esTeaType = 'teacher';
const defaultFields = [ 'location', 'school', 'major', 'good_subject', 'self_introduction', 'free_time', 'expect_compensation' ];

class SearchService extends Service {

  // 查 搜索
  async search(keywords) {
    const { ctx, app } = this;

    // TODO 完善搜索规则
    // 使用elasticsearch进行中文搜索
    const result = await client.search({
      index: esIndex,
      type: esTeaType,
      // analyzer: 'ik_smart',
      // from: 0, // Starting offset (default: 0)
      _source: '',
      body: {
        query: {
          multi_match: {
            query: keywords,
            fields: defaultFields,
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
  }

  // 同步mysql和elasticsearch数据
  // 增
  async create(item_id, options) {
    const { ctx } = this;
    // 处理参数
    const created_at = moment(options.created_at).format('YYYY-MM-DD');
    options = ctx.helper.objFilter(options, defaultFields);
    options.created_date = created_at;
    try {
      await client.create({
        id: item_id,
        index: esIndex,
        type: esTeaType,
        body: options,
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/search.js create] ${e.toString()}`);
    }
  }

  // 改
  async update(item_id, options) {
    const { ctx } = this;
    options = ctx.helper.objFilter(options, defaultFields);
    try {
      await client.update({
        id: item_id,
        index: esIndex,
        type: esTeaType,
        body: {
          doc: options,
        },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/search.js update] ${e.toString()}`);
    }
  }

  // 删
  async delete(item_id) {
    const { ctx } = this;
    try {
      await client.delete({
        id: item_id,
        index: esIndex,
        type: esTeaType,
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[未知错误 service/search.js delete] ${e.toString()}`);
    }
  }
}

module.exports = SearchService;
