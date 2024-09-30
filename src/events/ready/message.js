const { Events } = require("discord.js");
const PREFIX = "!";

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message, client) {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;
    try {
      await command.run(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command!");
    }
  },
};
