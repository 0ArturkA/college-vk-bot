import VK, { MessageContext } from 'vk-io';

import { Command } from '../interfaces/command.interface';
import { getRandomInt } from '../utils';

const handler = async (context: MessageContext, vk: VK) => {
  const members = await vk.api.messages.getConversationMembers({
    peer_id: context.peerId,
  });

  // Get random profile
  const randomProfile =
    members.profiles[getRandomInt(0, members.profiles.length)];

  context.send(
    `🎣 Get over here - ${randomProfile.first_name} ${randomProfile.last_name}`,
  );
};

const command: Command = {
  name: 'hook',
  commands: ['/h', '/hook'],
  handler,
};

export default command;