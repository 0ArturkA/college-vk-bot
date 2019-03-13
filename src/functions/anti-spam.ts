import config from 'config';
import ms from 'ms';
import { MessageContext } from 'vk-io';

import { UserModel } from '../models/user';
import { t } from '../translate';

const warnings = {};
const delay = {};
export const antiSpam = async (context: MessageContext): Promise<void> => {
  if (!delay[context.senderId]) {
    delay[context.senderId] = {
      counter: 1,
    };
  } else {
    delay[context.senderId].counter++;
  }

  clearTimeout(delay[context.senderId].timer);
  if (delay[context.senderId].counter >= 5) {
    delete delay[context.senderId];

    // Spam warning
    if (!warnings[context.senderId]) {
      context.send(`🚨 ${t('SPAM_WARNING')}`);
      warnings[context.senderId] = setTimeout(
        () => delete warnings[context.senderId],
        ms('1m'),
      );
    } else {
      // Penalize for spam
      const foundUser = await UserModel.findOne({ id: context.senderId });

      const penalizeExpCount = config.get('spamExpPenalize');
      if (foundUser.exp >= penalizeExpCount) {
        context.send(
          `🚨 ${t('SPAM_PENALIZE')}: ${penalizeExpCount} ${t('EXP')}`,
        );
        await UserModel.findByIdAndUpdate(foundUser._id, {
          $inc: {
            exp: -penalizeExpCount,
          },
        });
      }

      clearTimeout(warnings[context.senderId]);
      delete warnings[context.senderId];
    }

    return;
  }

  delay[context.senderId].timer = setTimeout(
    () => delete delay[context.senderId],
    ms('5s'),
  );
};
