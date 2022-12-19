/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const merge = require("lodash.merge");
const DelFile = require("./webpack/plugins/DelFile");

const IS_NODE_ENV = process.env.WEBPACK_BUILD_ENV === "node";
const IS_PROD_ENV = process.env.NODE_ENV === "production";

module.exports = {
  outputDir: "./dist",
  productionSourceMap: false,
  css: {
    // extract: process.env.NODE_ENV === 'production
    extract: false,
  },
  publicPath:
    process.env.NODE_ENV !== "production" ? "http://localhost:8080" : "/",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    open: false,
    hot: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      "/api": {
        target: "http://localhost:7001", //  本地
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  configureWebpack: {
    entry: `./src/entry-${IS_NODE_ENV ? "server" : "client"}.ts`,
    devtool: "source-map",
    target: IS_NODE_ENV ? "node" : "web",
    node: IS_NODE_ENV ? undefined : false,
    output: {
      libraryTarget: IS_NODE_ENV ? "commonjs2" : undefined,
    },
    externals:
      process.env.NODE_ENV === "production" && !IS_NODE_ENV
        ? {
            vue: "Vue",
            "element-ui": "element-ui",
          }
        : undefined,
    // optimization: {
    //   splitChunks: undefined,
    // },
    plugins: [
      IS_NODE_ENV ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": `"${process.env.NODE_ENV || "development"}"`, // 注意需要用双引号包住
        "process.env.IS_NODE_ENV": IS_NODE_ENV, // node 还是 web 环境
      }),
    ],
  },
  chainWebpack: (config) => {
    // fix ssr hot update bug
    if (IS_NODE_ENV) {
      config.plugins.delete("hmr");
      config.optimization.splitChunks(undefined);
    }
    if (IS_PROD_ENV) {
      config.plugin("DelFile").use(
        new DelFile({
          del_list: ["index.html"], // index.html 没什么用
        })
      );
    }
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        merge(options, {
          optimizeSSR: false,
        });
      });
  },
};
