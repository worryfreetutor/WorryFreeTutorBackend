'use strict';

const Service = require('egg').Service;
const userErrCode = require('../../config/errCode').userErrCode;

const path = require('path');
const uuid = require('node-uuid');
const fs = require('mz/fs');
const COS = require('cos-nodejs-sdk-v5');

class UploadImgService extends Service {
  async updateUserAvatar(account) {
    const { ctx, config } = this;
    const { SecretId, SecretKey, Bucket, Region, UserAvatarFolder } = config.cos;
    const cos = new COS({
      SecretId,
      SecretKey,
    });
    // 找到account对应的旧头像
    let user;
    try {
      user = await ctx.model.User.findOne({
        attribute: [ 'avatar' ],
        where: { account },
      });
    } catch (e) {
      ctx.logger.warn(e);
      throw ctx.helper.createError(`[service/uploadImg uploadUserAvatar] 查找用户 ${e.toString()}`);
    }
    const oldAvatarUrl = user.avatar;
    // 获取上传图片上传到云对象存储
    const file = ctx.request.files[0];
    const filename = `${uuid.v1()}${path.extname(file.filename).toLowerCase()}`;
    await cos.putObject({
      Bucket,
      Region,
      Key: `${UserAvatarFolder}/${filename}`,
      Body: fs.readFileSync(file.filepath),
    }, async (err, data) => {
      if (err) {
        // 抛出错误
        ctx.logger.warn(err);
        throw ctx.helper.createError('上传头像失败', userErrCode.uploadAvatar.uploadFail);
      }
      // 更新用户头像url字段
      try {
        await ctx.model.User.update({
          avatar: data.Location,
        }, {
          where: {
            account,
          },
        });
      } catch (e) {
        ctx.logger.warn(e);
        throw ctx.helper.createError(`[service/uploadImage uploadUserAvatar] 更新用户头像url ${e.toString()}`);
      }
    });
    if (oldAvatarUrl) {
      // 删除旧头像
      await cos.deleteObject({
        Bucket,
        Region,
        Key: `${UserAvatarFolder}/${oldAvatarUrl.split('/').pop()}`,
      }, (err, data) => {
        // 日志记录
        err ? ctx.logger.warn(err) : console.log(data);
      });
    }
  }
}

module.exports = UploadImgService;
