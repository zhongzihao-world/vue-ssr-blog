import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import path = require('path');

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1585835586704_8361';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.cluster = {
    listen: {
      port: 7001,
    },
  };

  // add your config here
  config.middleware = ['gzip', 'server', 'verify',];
  config.verify = {
    enable: true,
    // 只对POST请求做验证
    match(ctx) {
      return ctx.request.method === 'POST';
    },
  };

  // 设置没有安全验证
  config.security = {
    csrf: {
      ignore: () => true,
    },
  };
  config.static = {
    dir: [ path.join(appInfo.baseDir, 'OutPut'), path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'dist') ],
    prefix: '/',
    buffer: false,
    gzip: true,
  };
  config.gzip = {
    threshold: 1024, // 大于 1kb 进行压缩
  };
  config.bodyParser = {
    jsonLimit: '100mb',
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  };
  config.mongoose = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/blog',
    options: {
      poolSize: 40,
    },
  };
  config.logger = {
    outputJSON: true,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
