import * as mongoose from 'mongoose';

export default interface Code {
  _id?: mongoose.Types.ObjectId | string;
  email: string;
  code: string;
  expired_time: number;
  created_time: Date;
};
