import * as mongoose from 'mongoose';

export default interface Comment {
  _id?: mongoose.Types.ObjectId | string;
  user_id: mongoose.Types.ObjectId | string;
  article_id: mongoose.Types.ObjectId | string;
  content: string;
  created_time: Date;
  updated_time: Date;
};
