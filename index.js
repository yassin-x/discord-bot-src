const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const connectDB = require("./utils/db/database.js");
connectDB();
client.commands = new Collection();
client.slashCommands = new Collection();
client.allCommands = [];

const { loadCommands } = require("./utils/handler/commandHandler");
loadCommands(client);

const { loadEvents } = require("./utils/handler/eventHandler");
loadEvents(client);

const { token } = require("./config.json");
client.login(token);