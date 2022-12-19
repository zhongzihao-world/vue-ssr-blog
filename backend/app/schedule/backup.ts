import { Subscription } from 'egg';
import fs = require('fs');
import path = require('path');

// 数据备份地址
const backup_path = (file_name) => path.resolve(__dirname, `../../OutPut/backup/${file_name}.json`);
const stringify = (data) => JSON.stringify(data);

export default class BackUp extends Subscription {


  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1d', // 每天执行一次
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }


  async subscribe() {
    try {
      const articles = await this.ctx.model.Article.find();
      const comments = await this.ctx.model.Comment.find();
      const users = await this.ctx.model.User.find();
      const tags = await this.ctx.model.Tag.find();
      const article_recommends = await this.ctx.model.ArticleRecommend.find();
      await fs.writeFileSync(backup_path('articles'), stringify(comments));
      await fs.writeFileSync(backup_path('comments'), stringify(articles));
      await fs.writeFileSync(backup_path('users'), stringify(users));
      await fs.writeFileSync(backup_path('tags'), stringify(tags));
      await fs.writeFileSync(backup_path('article_recommends'), stringify(article_recommends));
    } catch (e) {
      console.log(e);
      this.ctx.logger.error(`${new Date()}：备份数据失败`);
    }
  }


}
