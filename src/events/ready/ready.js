const { Events, REST, Routes } = require("discord.js");
const ServerInfo = require("../../../utils/models/server");
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log("Loaded commands:", client.allCommands);

    const commands = Array.from(client.slashCommands.values()).map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options || [],
      type: cmd.type,
    }));

    const rest = new REST({ version: "10" }).setToken(process.env.token);
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }

    const clientGuilds = await Promise.all(
      client.guilds.cache.map(async (guild) => {
        const serverId = guild.id;

        let server = await ServerInfo.findOne({ guid: serverId });

        if (!server) {
          server = new ServerInfo({ guid: serverId });
          await server.save();
        }
      })
    );
  },
};
