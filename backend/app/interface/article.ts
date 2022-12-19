import * as mongoose from 'mongoose';

export default interface Article {
  _id?: mongoose.Types.ObjectId | string;
  user_id: mongoose.Types.ObjectId | string;
  tag_id: mongoose.Types.ObjectId | string;
  title: string;
  status?: boolean;
  mark_content?: string;
  content?: string;
  weather?: string;
  image?: string;
  images?: [];
  pv?: number;
  created_time?: Date;
  updated_time?: Date;
}
