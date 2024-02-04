const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from a channel.')
        .setDescriptionLocalizations({
            nl: 'Verwijder berichten uit een kanaal.'
        })
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription("The amount of messages to clear.")
            .setDescriptionLocalizations({
                nl: 'Het aantal berichten dat verwijderd moet worden.'
            })
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.deferReply();

        let amount = interaction.options.getInteger('amount');

        if (amount > 100) amount = 100;
        if (amount < 1) amount = 1;

        let errorembed = new EmbedBuilder()
            .setColor("#eb4344")
            .setTitle("Error")
            .setDescription("There wen't something wrong while executing this command")
            .setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148714658564415488/6426-error.png")
            .setTimestamp();

        await interaction.channel.bulkDelete(amount, true).catch(err => {
            errorembed.setDescription("There wen't something wrong while deleting the messages.");
            return interaction.editReply({ embeds: [errorembed] });
        });

        let embed = new EmbedBuilder()
            .setColor("#26ae88")
            .setTitle("Clear")
            .setDescription(`Successfully deleted \`${amount}\` messages.`)
            .setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716657393532968/1697_Success_512x512_by_DW.png")
            .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });

    },
};
