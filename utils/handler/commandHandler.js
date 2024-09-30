const fs = require("fs");
const path = require("path");

function loadCommands(client) {
  client.allCommands = [];

  const commandsDir = path.join(__dirname, "../../src/commands");

  loadCommandsFromDirectory(client, commandsDir);
}

function loadCommandsFromDirectory(client, dir) {
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
      }

      if (command.dataSlash) {
        client.slashCommands.set(command.dataSlash.name, command.dataSlash);
        client.allCommands.push({
          name: command.dataSlash.name,
          permission: command.dataSlash.permission || "None",
          type: "slash",
        });
      }
    }
  }
}

module.exports = { loadCommands };
