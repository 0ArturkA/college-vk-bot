import { MessageContext } from 'vk-io';

export enum CommandHelpCategory {
  Timetable = '📅 Расписание',
  // Profile = '👤 Профиль',
  // Fun = '🌸 Развлечения',
  Other = '🛠️ Остальное',
}

export abstract class Command {
  static mapCommandPrefix(arr: string[]): string[] {
    return arr.map(a => (process.env.CMD_PREFIX || '/') + a);
  }

  protected constructor(
    private readonly name: string,
    private readonly aliases: string[],
    private readonly helpCategory: CommandHelpCategory = CommandHelpCategory.Other,
    private readonly helpDescription: string = 'NONE',
  ) {
  }

  getName(): string {
    return this.name;
  }

  getAliases(): string[] {
    return this.aliases;
  }

  getAliasesWithPrefix(): string[] {
    return Command.mapCommandPrefix(this.aliases);
  }

  getHelpCategory(): CommandHelpCategory {
    return this.helpCategory;
  }
  
  getHelpDescription(): string {
    return this.helpDescription;
  }
  
  abstract execute(ctx: MessageContext): void | Promise<void>;
}