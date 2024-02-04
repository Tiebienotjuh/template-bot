const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const logger = require('./functions/logger.js');
const fs = require('node:fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, , GatewayIntentBits.GuildMembers] });

const commands = [];
client.commands = new Collection();

const commandsFolder = fs.readdirSync("./commands");
for (const folder of commandsFolder) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

const eventsFolder = fs.readdirSync("./events");
for (const folder of eventsFolder) {
    const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));

    if(folder === "client") {
        for (const file of eventFiles) {
            const event = require(`./events/${folder}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}
const rest = new REST().setToken(token);
(async () => {
    try {            
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { 
            body: commands
         },
        );
        return logger.debug("Successfully registered application commands.")
    } catch (error) {
        logger.error(error);
    }
})();

client.login(token);
