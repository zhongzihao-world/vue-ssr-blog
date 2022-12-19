
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    photo_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Photo',
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  });
  return mongoose.model('photo_like', PostSchema);
};
