
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expired_time: {
      type: Number,
      required: true,
    },
    created_time: {
      type: Date,
      required: true,
    },
  });
  return mongoose.model('Code', PostSchema);
};
