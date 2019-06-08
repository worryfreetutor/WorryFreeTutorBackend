'use strict';
module.exports = {
  /**
   * 从token中获取payload，并返回
   * @param {token} : 令牌
   * @return paylod : {object}
   */
  async getPayload(token) {
    const { app } = this;
    const secret = app.config.jwt.secret;
    console.log(token);
    return await app.jwt.verify(token.split(' ')[1], secret);
  },
};
