import * as mongoose from 'mongoose';

export default interface User {
  _id?: mongoose.Types.ObjectId | string;
  email: string;
  password: string;
  nick_name?: string;
  header?: string;
  sex?: number;
  birthday?: Date;
  blood?: string;
  qq_number?: string;
  showe_mail?: boolean;
  summary?: string;
  blog_url?: string;
  created_time?: Date;
  updated_time?: Date;
}
