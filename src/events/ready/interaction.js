const { Events, PermissionFlagsBits } = require("discord.js");
const BlackList = require("../../../utils/models/blacklist");
const { DevId } = require("../../../config.json");
const { safeReply } = require("../../../utils/handler/errorHandle");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    const userAuthor = interaction.guild.members.cache.get(
      interaction.member.id
    );
    const bot = interaction.guild.members.cache.get(client.user.id);
    const isOwner = interaction.guild.ownerId === userAuthor.id;

    let BlackListData;
    try {
      BlackListData = await BlackList.findOne({ id: userAuthor.id });
    } catch (err) {
      return await interaction.reply("Error fetching blacklist data:");
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
      return await interaction.reply("❌ | you are blacklisted");
    }

    if (!botHasPerms && !botIsAdmin) {
      return await interaction.reply(
        `❌ | I don't have permission \`${permissions.bot}\``
      );
    }

    if (permissions.ownership && !isOwner && !isDev) {
      return await interaction.reply(
        "❌ | this command can only be used by the owner or developers"
      );
    }

    if (!userHasPerms && !userIsAdmin && !isDev) {
      return await interaction.reply(
        `❌ | you don't have permission \`${permissions.member}\``
      );
    }

    if (
      permissions.roles &&
      !permissions.roles.some((roleId) => member.roles.cache.has(roleId)) &&
      !userIsAdmin &&
      !isDev
    ) {
      return await interaction.reply(
        `❌ | you need one of the following roles: ${permissions.roles.join(
          ", "
        )}`
      );
    }

    if (command.perms === "dev" && !isDev) {
      return await interaction.reply(
        "❌ | this command can only be used by developers"
      );
    }

    try {
      await command.run(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing that command!",
        ephemeral: true,
      });
    }
  },
};
