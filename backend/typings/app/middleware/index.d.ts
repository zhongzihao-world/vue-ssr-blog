// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGzip from '../../../app/middleware/gzip';
import ExportServer from '../../../app/middleware/server';
import ExportVerify from '../../../app/middleware/verify';

declare module 'egg' {
  interface IMiddleware {
    gzip: typeof ExportGzip;
    server: typeof ExportServer;
    verify: typeof ExportVerify;
  }
}
