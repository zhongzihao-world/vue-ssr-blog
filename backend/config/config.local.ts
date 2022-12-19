import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // 本地环境
  config.URL = 'http://localhost:7001';

  return config;
};
