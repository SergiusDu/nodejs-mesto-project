import { model, Schema } from 'mongoose';
import { ICard } from '../types/card';

const CardScheme = new Schema<ICard>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      required: false,
    },
    createAt: {
      type: Date,
      required: true,
    },
  },
);

export default model<ICard>('card', CardScheme);
