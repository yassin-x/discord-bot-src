const { Client, GatewayIntentBits, Collection } = require("discord.js");
require("dotenv").config();
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
client.coolDowns = new Collection();
client.slashCommands = new Collection();
client.allCommands = [];

const { loadCommands } = require("./utils/handler/commandHandler");
loadCommands(client);

const { loadEvents } = require("./utils/handler/eventHandler");
loadEvents(client);

client.login(process.env.token);
