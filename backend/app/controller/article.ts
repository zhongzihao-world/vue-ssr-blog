import { Controller } from "egg";

import Article from "../interface/article";

export default class ArticleController extends Controller {
  async getArticleList() {
    try {
      const { current_page, page_size, key_word, current_tag_id, order_field } =
        this.ctx.query;

      let article_list: Array<Article>;
      if (order_field === "recommend") {
        article_list = await this.service.article.getRecommendArticleList(
          Number(current_page),
          Number(page_size),
          key_word,
          current_tag_id
        );
      } else {
        article_list = await this.service.article.getArticleList(
          Number(current_page),
          Number(page_size),
          key_word,
          current_tag_id
        );
      }
      this.ctx.body = {
        ret: 200,
        content: article_list,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async getUserArticleList() {
    try {
      const { user_id, current_page, page_size } = this.ctx.query;

      const article_list = await this.service.article.getUserArticleList(
        user_id,
        Number(current_page),
        Number(page_size)
      );

      this.ctx.body = {
        ret: 200,
        content: article_list,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async getArticleDetail() {
    try {
      const { article_id, is_pv_add } = this.ctx.query;

      if (is_pv_add === "true") {
        this.service.article.articlePvAdd(article_id);
      }
      const article_detail = await this.service.article.getArticleDetail(
        article_id
      );
      this.ctx.body = {
        ret: 200,
        content: article_detail,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async createArticle() {
    try {
      const {
        tag_id,
        title,
        status,
        mark_content,
        content,
        weather,
        image,
        images,
      } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      await this.service.article.createArticle(
        user._id,
        tag_id,
        title,
        status,
        mark_content,
        content,
        weather,
        image,
        images
      );

      this.ctx.body = {
        ret: 200,
        content: [],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async updateArticle() {
    try {
      const {
        _id,
        tag_id,
        title,
        status,
        mark_content,
        content,
        weather,
        image,
        images,
      } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      await this.service.article.updateArticle(
        _id,
        user._id,
        tag_id,
        title,
        status,
        mark_content,
        content,
        weather,
        image,
        images
      );

      this.ctx.body = {
        ret: 200,
        content: [],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async delArticle() {
    try {
      const { article_id } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      await this.service.article.delArticle(article_id, user._id);
      await this.service.comment.delAllArticleComment(article_id);

      this.ctx.body = {
        ret: 200,
        content: [],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async changeArticleStatus() {
    try {
      const { article_id, status } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      await this.service.article.changeArticleStatus(
        article_id,
        user._id,
        status
      );
      this.ctx.body = {
        ret: 200,
        content: [],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async userArticleCount() {
    try {
      const { user_id } = this.ctx.request.query;

      const article_count = await this.service.article.userArticleCount(
        user_id
      );

      this.ctx.body = {
        ret: 200,
        content: article_count,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }
}
