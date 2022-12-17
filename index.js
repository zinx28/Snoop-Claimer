const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require("mongoose");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });

client.config = require("./config.json");
client.prefix = client.config.prefix;
const config = require("./config.json")

client.login(config.token);

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();

require("./handler")(client)
require("./mongoose")(mongoose)

