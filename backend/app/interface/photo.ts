import * as mongoose from 'mongoose';

export default interface Photo {
  _id?: mongoose.Types.ObjectId | string;
  user_id: mongoose.Types.ObjectId | string;
  url: string;
  width: number;
  height: number;
  type?: string;
  created_time: Date;
  updated_time: Date;
  describe?: string;
  like_count?: number;
}
