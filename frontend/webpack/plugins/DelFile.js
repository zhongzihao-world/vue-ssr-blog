/**
 * 打包后，删除无用的文件
 */
class DelFile {
  constructor(options) {
    this.list = options && options.del_list ? options.del_list : [];
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('DelFile', (compilation, cb) => {
      this.list.forEach(file_name => {
        delete compilation.assets[file_name];
      });
      cb();
    });
  }
}

module.exports = DelFile;
