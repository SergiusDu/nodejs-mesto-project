import { Schema } from 'mongoose';

export interface ICard {
  _id?: Schema.Types.ObjectId;
  name: string;
  link: string,
  owner: Schema.Types.ObjectId,
  likes: Schema.Types.ObjectId[],
  createAt: Date,
  __v: number;
}
