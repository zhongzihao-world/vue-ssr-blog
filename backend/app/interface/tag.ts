import * as mongoose from 'mongoose';

export default interface Tag {
  _id?: mongoose.Types.ObjectId | string;
  tag_name: string;
  sort_id: number;
  created_time?: Date;
  updated_time?: Date;
};
