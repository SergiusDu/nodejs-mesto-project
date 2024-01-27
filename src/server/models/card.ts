import { model, Schema } from 'mongoose';
import { ICard } from '../types/card';
import { MONGOOSE_URL_VALIDATOR } from '../utils/validation/common';
import {
  CARD_LIKES_KEY,
  CARD_LINK_KET,
  CARD_MONGOOSE_MODEL_NAME,
  CARD_NAME_KEY,
  CARD_NAME_MAX_LENGTH,
  CARD_NAME_MIN_LENGTH,
  CARD_OWNER_KEY,
} from '../constants/card';
import {
  mongooseMaxLimitsDescriber,
  mongooseMinLimitsDescriber,
  mongooseRequiredFieldDescriber,
} from '../utils/server-api';
import { USER_MONGOOSE_MODEL_NAME } from '../constants/user';

const CardScheme = new Schema<ICard>(
  {
    name: {
      type: String,
      minlength: mongooseMinLimitsDescriber(CARD_NAME_MIN_LENGTH, CARD_NAME_KEY),
      maxlength: mongooseMaxLimitsDescriber(CARD_NAME_MAX_LENGTH, CARD_NAME_KEY),
      required: mongooseRequiredFieldDescriber(CARD_NAME_KEY),
    },
    link: {
      type: String,
      validate: MONGOOSE_URL_VALIDATOR,
      required: mongooseRequiredFieldDescriber(CARD_LINK_KET),
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: USER_MONGOOSE_MODEL_NAME,
      required: mongooseRequiredFieldDescriber(CARD_OWNER_KEY),
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: USER_MONGOOSE_MODEL_NAME,
      required: mongooseRequiredFieldDescriber(CARD_LIKES_KEY),
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default model<ICard>(CARD_MONGOOSE_MODEL_NAME, CardScheme);
