
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    article_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Article',
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  });
  return mongoose.model('article_recommend', PostSchema);
};
