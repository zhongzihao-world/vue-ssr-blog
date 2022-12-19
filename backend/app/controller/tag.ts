import { Controller } from "egg";

export default class TagController extends Controller {
  async getTagList() {
    try {
      let tag_list = await this.service.tag.getTagList();
      tag_list.sort((a, b) => b.sort_id - a.sort_id);

      this.ctx.body = {
        ret: 200,
        content: tag_list,
      };
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        ret: 0,
        content: `${e}`,
      };
    }
  }
}
