import { Controller } from "egg";

export default class CommentController extends Controller {
  async getArticleComment() {
    try {
      const { article_id } = this.ctx.query;

      const comment_list = await this.service.comment.getArticleComment(
        article_id
      );
      this.ctx.body = {
        ret: 200,
        content: comment_list,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async addArticleComment() {
    try {
      const { article_id, comment_text } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      await this.service.comment.addArticleComment(
        article_id,
        comment_text,
        user._id
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

  async delArticleComment() {
    try {
      const { comment_id } = this.ctx.request.body;

      await this.service.comment.delArticleComment(comment_id);
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
}
