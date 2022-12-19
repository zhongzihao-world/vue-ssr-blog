import { Controller } from "egg";

export default class PhotoController extends Controller {
  async uploadHeaderPhoto() {
    try {
      const user = await this.service.user.getCurrentUserInfo();
      const photo_url = await this.service.photo.saveInLocal(
        "header",
        user._id + ".png"
      );

      this.ctx.body = {
        ret: 200,
        errno: 0,
        data: [this.app.config.URL + photo_url],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async uploadArticlePhoto() {
    try {
      const photo_url = await this.service.photo.saveInLocal("article");

      this.ctx.body = {
        ret: 200,
        errno: 0,
        data: [this.app.config.URL + photo_url],
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async uploadPhotoWall() {
    try {
      const user = await this.service.user.getCurrentUserInfo();
      const photo_url = await this.service.photo.saveInLocal("photo");
      const { local_url, remote_url } = await this.service.qiniu.uploadRemote(
        photo_url
      );
      await this.service.photo.savePhotoWall(user._id, local_url, remote_url);
      await this.service.photo.delLocalPhoto(local_url);

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

  async getPhotoList() {
    try {
      const { current_page, page_size } = this.ctx.query;
      const photo_list = await this.service.photo.getPhotoList(
        Number(current_page),
        Number(page_size)
      );

      this.ctx.body = {
        ret: 200,
        content: photo_list,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async getUserPhotoList() {
    try {
      const { user_id, current_page, page_size } = this.ctx.query;

      const user_photo_list = await this.service.photo.getUserPhotoList(
        user_id,
        Number(current_page),
        Number(page_size)
      );
      this.ctx.body = {
        ret: 200,
        content: user_photo_list,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async editPhotoDescribe() {
    try {
      const { photo_id, photo_describe } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      await this.service.photo.ediPhotoDescribe(
        photo_id,
        user._id,
        photo_describe
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

  async delPhoto() {
    try {
      const { photo_id, url } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      const file_name = url.substring(url.lastIndexOf("/") + 1);
      await this.service.qiniu.deleteRemote(file_name);
      await this.service.photo.delPhoto(photo_id, user._id);
      await this.service.photo.delPhotoLike(photo_id);

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

  async likePhoto() {
    try {
      const { photo_id } = this.ctx.request.body;
      const user = await this.service.user.getCurrentUserInfo();

      const is_like_photo = await this.service.photo.isLikePhoto(
        photo_id,
        user._id
      );
      if (is_like_photo) {
        this.ctx.body = {
          ret: 500,
          content: "您已经点赞过~",
        };
      } else {
        await this.service.photo.addPhotoLike(photo_id, user._id);
        await this.service.photo.photoPvAdd(photo_id);

        this.ctx.body = {
          ret: 200,
          content: [],
        };
      }
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 500,
        content: `${e}`,
      };
    }
  }

  async userPhotoCount() {
    try {
      const { user_id } = this.ctx.request.query;

      const photo_count = await this.service.photo.userPhotoCount(user_id);

      this.ctx.body = {
        ret: 200,
        content: photo_count,
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
