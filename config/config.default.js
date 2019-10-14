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
      database: 'wft_dev',
      timezone: '+08:00',
    },
    view: {
      defaultViewEngine: 'nunjucks',
    },
    multipart: {
      mode: 'file',
    },
    cos: {
      // SecretId: 'AKIDTlT0LRmtFahIePnb3LtNbeopa5LgrbBX' // (g)
      SecretId: 'AKID70d08bVqeDXbQUJ7YnqjNl1751lHxXHl',
      // SecretKey: 'xiEMZFiCRb3JhSsD5WllUisqBHIKyPs7' // (g)
      SecretKey: 'OWO1OVLwIOJ2VifN2SggQxEI7h160oQo',
      // Bucket: 'feapp-test-1259186164' // (g)
      Bucket: 'feapp-test-1256757654', // 存储桶名称
      Region: 'ap-guangzhou', // Bucket 所在地域
      UserAvatarFolder: 'user-avatar', // 存放用户头像的文件夹
    },
    redis: {
      client: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        password: null,
        db: 0,
      },
    },
    AliSms: {
      accessKeyId: 'LTAIgYqTJIJhKfgt',
      accessKeySecret: 'JYOtrceiRIQrF3dO4sAtUOBLW5Vy7g',
      expiredTime: 120, // 验证码有效时长
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1559744036638_5118';

  // add your middleware config here
  config.middleware = [ 'errHandler' ];
  // config.middleware = [];

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
