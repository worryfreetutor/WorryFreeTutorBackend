'use strict';

const Controller = require('egg').Controller;
const { teaItemErrCode } = require('../../config/errCode');

class CollectionController extends Controller {

  async _getItemById(ctx) {
    // 从GET请求参数中获取item_id
    const item_id = parseInt(ctx.request.query.item_id);
    if (!item_id) throw ctx.helper.createError('item_id参数错误', teaItemErrCode.teacherItem.itemIdNotFound);
    const res = await ctx.service.teacherItem.findByItemId(item_id);
    if (!res) throw ctx.helper.createError('此item_id不存在', teaItemErrCode.teacherItem.itemIdNotFound);
    return res;
  }

  /**
   * 获取收藏项目列表 GET
   */
  async getCollectionsList() {
    const { ctx } = this;
    const account = ctx.session.account;
    // TODO 外键关联上item信息 删除情况的处理
    const res = await ctx.model.TeaItemsCollection.findAll({
      attributes: [ 'id', 'createdAt' ],
      where: { account },
      include: [{
        model: ctx.model.TeacherItem.scope('itemlist'),
      }],
    });
    ctx.body = {
      data: res,
    };
  }

  /**
   * 收藏某项目 GET
   */
  async collectItem() {
    const { ctx } = this;
    const item = await this._getItemById(ctx);
    const account = ctx.session.account;
    // 防止数据库中多条一样的记录
    await ctx.model.TeaItemsCollection.findOrCreate({
      where: {
        account,
        item_id: item.item_id,
      },
      defaults: {
        account,
        item_id: item.item_id,
      },
    });
    ctx.body = '收藏成功';
  }

  /**
   * 取消收藏某项目 GET
   */
  async cancelCollectItem() {
    const { ctx } = this;
    const item = await this._getItemById(ctx);
    const account = ctx.session.account;
    await ctx.model.TeaItemsCollection.destroy({
      where: {
        account,
        item_id: item.item_id,
      },
    });
    ctx.body = '取消收藏成功';
  }
}

module.exports = CollectionController;
