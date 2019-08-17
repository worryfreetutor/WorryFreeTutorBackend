'use strict';

module.exports = {
  schedule: {
    interval: '60m', // 60 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const { Op } = ctx.app.Sequelize;
    await ctx.model.TeacherItem.update({
      status: 'EXPIRED',
    }, {
      where: {
        expire_date: {
          [Op.lt]: new Date(),
        },
      },
    });
  },
};
