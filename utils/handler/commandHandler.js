const fs = require("fs");
const path = require("path");
const Command = require("../models/commands");
function loadCommands(client) {
  client.allCommands = [];

  const commandsDir = path.join(__dirname, "../../src/commands");

  loadCommandsFromDirectory(client, commandsDir);
}

async function loadCommandsFromDirectory(client, dir) {
  const commandFiles = fs.readdirSync(dir);

  for (const file of commandFiles) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      loadCommandsFromDirectory(client, filePath);
    } else if (file.endsWith(".js")) {
      const command = require(filePath);

      if (command.dataCommand) {
        client.commands.set(command.dataCommand.name, command.dataCommand);
        client.allCommands.push({
          name: command.dataCommand.name,
          aliases: command.dataCommand.aliases || [],
          permission: command.dataCommand.permission || "None",
          type: "prefix",
        });

        const newCommand = await new Command({
          name: command.dataCommand.name,
          aliases: command.dataCommand.aliases || [],
          permission: command.dataCommand.permission || [],
          type: "prefix",
        });
        await newCommand.save();
      }

      if (command.dataSlash) {
        client.slashCommands.set(command.dataSlash.name, command.dataSlash);
        client.allCommands.push({
          name: command.dataSlash.name,
          permission: command.dataSlash.permission || "None",
          type: "slash",
        });

        const newCommand = await new Command({
          name: command.dataSlash.name,
          permission: command.dataSlash.permission || [],
          type: "slash",
        });
        await newCommand.save();
      }
    }
  }
}

module.exports = { loadCommands };
