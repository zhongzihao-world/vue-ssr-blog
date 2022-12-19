
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    tag_name: {
      type: String,
      required: true,
    },
    sort_id: {
      type: Number,
      default: 1,
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
  return mongoose.model('Tag', PostSchema);
};
