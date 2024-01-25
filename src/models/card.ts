import { model, Schema } from 'mongoose';
import { ICard } from '../types/card';
import { CARD_NAME_MAX_LENGTH, CARD_NAME_MIN_LENGTH } from '../constants/card';
import { MONGOOSE_URL_VALIDATOR } from '../utils/validation/common';

const CardScheme = new Schema<ICard>(
  {
    name: {
      type: String,
      minlength: CARD_NAME_MIN_LENGTH,
      maxlength: CARD_NAME_MAX_LENGTH,
      required: true,
    },
    link: {
      type: String,
      validate: MONGOOSE_URL_VALIDATOR,
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
