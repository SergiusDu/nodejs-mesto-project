import { model, Schema } from 'mongoose';

interface ICard {
  name: string;
  link: string,
  owner: string,
  likes: string[],
  createAt: Date,
}

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
