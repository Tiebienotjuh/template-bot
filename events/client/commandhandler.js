const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,

    execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if(!command) {
            interaction.reply({
                content: "Hier moet ik effe een super mooi embedje invoegen met een error erin.",
                ephemeral: true
            });
        }

        command.execute(interaction, client);
    }
}