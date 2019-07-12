/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
    jwt: {
      secret: '123456',
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    // mysql配置
    sequelize: {
      dialect: 'mysql',
      host: '49.234.6.109',
      port: 3306,
      username: 'root',
      password: 'gongyongMIMA666!',
      database: 'wft-dev',
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1559744036638_5118';

  // add your middleware config here
  config.middleware = [ 'errHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // 用户密码加密key
    userEncryptKey: '654321',
  };

  return {
    ...config,
    ...userConfig,
  };
};
