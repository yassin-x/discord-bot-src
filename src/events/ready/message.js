const { Events, PermissionFlagsBits } = require("discord.js");
const ServerInfo = require("../../../utils/models/server");
const BlackList = require("../../../utils/models/blacklist");
const { safeReply } = require("../../../utils/handler/errorHandle");
const { DevId } = require("../../../config.json");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;

    const serverId = message.guild.id;
    let prefixData;
    try {
      prefixData = await ServerInfo.findOne({ guid: serverId });
    } catch (error) {
      return safeReply(message, `Error fetching prefix: \`\`\`${error}\`\`\``);
    }

    const PREFIX = prefixData ? prefixData.prefix : "y!";

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    const userAuthor = message.guild.members.cache.get(message.author.id);
    const bot = await message.guild.members.fetch(client.user.id);
    if (!userAuthor) {
      return message.reply("❌ | User not found in the guild.");
    }

    const isOwner = message.guild.ownerId === userAuthor.id;

    let BlackListData;
    try {
      BlackListData = await BlackList.findOne({ id: userAuthor.id });
    } catch (err) {
      return message.reply("Error fetching blacklist data:");
    }

    const permissions = command.perms || {
      member: "",
      bot: "",
      roles: [],
      ownership: false,
    };

    const userHasPerms = permissions.member
      ? userAuthor.permissions.has(permissions.member)
      : true;
    const userIsAdmin = userAuthor.permissions.has(
      PermissionFlagsBits.Administrator
    );
    const botHasPerms = permissions.bot
      ? bot.permissions.has(permissions.bot)
      : true;
    const botIsAdmin = bot.permissions.has(PermissionFlagsBits.Administrator);
    const isDev = DevId.includes(userAuthor.id);

    if (command.blacklist && BlackListData && !isDev) {
      return message.reply("❌ | you are blacklisted");
    }

    if (!botHasPerms && !botIsAdmin) {
      return message.reply(
        `❌ | I don't have permission \`${permissions.bot}\``
      );
    }

    if (permissions.ownership && !isOwner && !isDev) {
      return message.reply(
        "❌ | this command can only be used by the owner or developers"
      );
    }

    if (!userHasPerms && !userIsAdmin && !isDev) {
      return message.reply(
        `❌ | you don't have permission \`${permissions.member}\``
      );
    }

    if (
      permissions.roles &&
      !permissions.roles.some((roleId) => member.roles.cache.has(roleId)) &&
      !userIsAdmin &&
      !isDev
    ) {
      return message.reply(
        `❌ | you need one of the following roles: ${permissions.roles.join(
          ", "
        )}`
      );
    }
    
    if (command.perms === "dev" && !isDev) {
      return message.reply("❌ | this command can only be used by developers");
    }

    try {
      await command.run(client, message, args, userAuthor);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command!");
    }
  },
};
