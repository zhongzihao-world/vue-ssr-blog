import { Service } from 'egg';
import * as qiniu from 'qiniu';
import path = require('path');

const bucket = ''; // 存储库名
const AK = '';
const SK = ''; // 密钥
const domain = ''; // 域名

export default class QiNiuService extends Service {


  // 获取 七牛token
  getUploadToken(): string {
    const mac = new qiniu.auth.digest.Mac(AK, SK);
    const options = {
      scope: bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }


  /** 上传到七牛云
   *
   * @param photo_url 图片地址
   */
  async uploadRemote(photo_url: string): Promise<{ local_url: string, remote_url: string }> {
    return new Promise((resolve, reject) => {
      const uploadToken: string = this.ctx.service.qiniu.getUploadToken();
      const config: any = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z2;

      const local_url = path.resolve(__dirname, '../../OutPut' + photo_url);
      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();
      const key: any = new Date().getTime();

      // 文件上传
      formUploader.putFile(uploadToken, key, local_url, putExtra, (respErr, respBody) => {
        console.log(respBody);
        if (respErr) {
          reject(JSON.stringify({ status: '-1', msg: '上传失败', error: respErr }));
        } else {
          resolve({
            local_url,
            remote_url: domain + respBody.key,
          });
        }
      });
    });
  }


  /** 删除七牛云照片
   *
   * @param file_name 文件名
   */
  async deleteRemote(file_name: string) {
    return new Promise((resolve, reject) => {
      const mac = new qiniu.auth.digest.Mac(AK, SK);
      const config: any = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z2;
      const bucketManager = new qiniu.rs.BucketManager(mac, config);
      bucketManager.delete(bucket, file_name, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
