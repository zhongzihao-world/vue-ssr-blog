
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    nick_name: {
      type: String,
      default: '路人甲',
    },
    header: {
      type: String,
      required: true,
    },
    sex: {
      type: Number,
      default: 1,
    },
    birthday: {
      type: Date,
      default: new Date(),
    },
    blood: {
      type: String,
      default: '',
    },
    qq_number: {
      type: String,
      default: '',
    },
    showe_mail: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
      default: '这个人很懒，什么都没留下',
    },
    blog_url: {
      type: String,
      default: '',
    },
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
  });
  return mongoose.model('User', PostSchema);
};
