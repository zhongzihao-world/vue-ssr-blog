
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    url: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    created_time: {
      type: Date,
      default: new Date(),
    },
    updated_time: {
      type: Date,
      default: new Date(),
    },
    describe: {
      type: String,
      default: '',
    },
    like_count: {
      type: Number,
      default: 0,
    },
  });
  return mongoose.model('Photo', PostSchema);
};
