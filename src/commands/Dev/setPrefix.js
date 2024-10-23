const Server = require("../../../utils/models/server");

module.exports = {
  dataCommand: {
    name: "set-prefix",
    perms: { ownership: true },
    description: "New Prefix",
    run: async (client, message, args) => {
      const newPrefix = args[0];
      if (!newPrefix) {
        return message.reply("type new Prefix");
      }

      const serverId = message.guild.id;

      try {
        let prefixData = await Server.findOne({ guid: serverId });

        if (prefixData) {
          prefixData.prefix = newPrefix;
          await prefixData.save();
          return message.reply(`done update prefix to: ${newPrefix}`);
        } else {
          prefixData = new Prefix({ guid: serverId, prefix: newPrefix });
          await prefixData.save();
          return message.reply(`new prefix is : ${newPrefix}`);
        }
      } catch (error) {
        console.error(error);
        return message.reply("error save new prefix");
      }
    },
  },
};
