'use strict';
const { teaItemErrCode } = require('../../config/errCode');

module.exports = () => {
  /**
   * 获取query参数item_id，验证item_id并设置item信息
   */
  return async function(ctx, next) {
    const { item_id } = ctx.request.query;
    if (!item_id) throw ctx.helper.createError('无item_id参数', teaItemErrCode.teacherItem.noItemIdParam);
    let item;
    try {
      item = await ctx.model.TeacherItem.findOne({
        where: { item_id },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[校验item_id中间件] 未知错误 ${e.toString()}`);
    }
    if (!item) throw ctx.helper.createError('找不到该item', teaItemErrCode.teacherItem.itemIdNotFound);
    ctx.session.teacherItem = item;
    await next();
  };
};
