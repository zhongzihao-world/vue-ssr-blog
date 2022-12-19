/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const resolve = (file) => path.resolve(__dirname, file);

const { createBundleRenderer } = require('vue-server-renderer');
const bundle = require('../../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../../dist/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('../../dist/index.temp.html'), 'utf-8'),
  clientManifest,
  inject: false,
});

function renderToString(context): Promise<string> {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
}


module.exports = () => {
  const white_list: Array<string> = [ '/api', '/sourse' ];
  return async (ctx, next) => {
    // api sourse类的请求直接到下一个中间件
    const is_white_list: boolean = white_list.some(item => ctx.path.startsWith(item));
    if (is_white_list) {
      return await next();
    } else {
      try {
        console.log('渲染页面：', ctx.path);
        const context = {
          title: '前端工程师日记',
          url: ctx.path,
        };
        const html: string = await renderToString(context);
        ctx.body = html;
      } catch (e) {
        console.log(e);
        ctx.logger.error(new Error(ctx.path));
        ctx.logger.error(new Error(e));
      }
    }
    // await next();
  };
};
