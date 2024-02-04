const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user from the server.')
		.setDescriptionLocalizations({
			nl: 'Kick een gebruiker van de server.'
		})
		.addUserOption(option => option
			.setName('user')
			.setDescription("The user to kick.")
			.setDescriptionLocalizations({
				nl: 'De gebruiker die gekickt moet worden.'
			})
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription("The reason why the user is kicked.")
			.setDescriptionLocalizations({
				nl: 'De reden waarom de gebruiker gekickt wordt.'
			})
			.setRequired(false)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		await interaction.deferReply();

		let user = interaction.options.getUser('user');
		let member = interaction.guild.members.cache.get(user.id);
		let reason = interaction.options.getString('reason') || 'No reason.';

		let errorembed = new EmbedBuilder()
			.setColor("#eb4344")
			.setTitle("Error")
			.setDescription("There wen't something wrong while executing this command")
			.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148714658564415488/6426-error.png")
			.setTimestamp();

		if (!member) {
			errorembed.setDescription("The user you tried to kick is not in the server.");
			return interaction.editReply({ embeds: [errorembed] });
		}

		if (!member.kickable) {
			errorembed.setDescription("The bot doesn't have the permission to kick this user.");
			return interaction.editReply({ embeds: [errorembed] });
		}

		if (member.id === interaction.user.id) {
			errorembed.setDescription("The bot can't kick you because your amazing.");
			return interaction.editReply({ embeds: [errorembed] });
		}

		let embed = new EmbedBuilder()
			.setColor("#FF0000")
			.setTitle("Kick")
			.setDescription(`Are you sure you want to kick \`${member.user.globalName}\`?`)
			.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148714658564415488/6426-error.png")
			.setTimestamp();

		let button = new ButtonBuilder()
			.setCustomId('kick')
			.setLabel('Kick')
			.setStyle(ButtonStyle.Danger);

		let button2 = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		let row = new ActionRowBuilder()
			.addComponents(button, button2);

		await interaction.editReply({ embeds: [embed], components: [row] });

		const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

		collector.on('collect', async i => {
			if (i.customId === 'kick') {
				embed.setDescription(`Successfully kicked \`${member.user.globalName}\`\nUser has received a DM about the kick.`);
				embed.setColor("#26ae88");
				embed.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716657393532968/1697_Success_512x512_by_DW.png");

				let kickembed = new EmbedBuilder()
					.setColor("#5965ed")
					.setTitle("Kicked")
					.setDescription(`You have been kicked from the Xaroz discord. You can join the server again with this link: https://discord.gg/GTFKKfRvY7`)
					.addFields(
						{ name: "Reason", value: reason, inline: true },
						{ name: "Moderator", value: i.user.globalName, inline: true }
					)
					.setTimestamp();

				await member.send({ embeds: [kickembed] }).catch(() => {
					embed.setDescription(`Successfully kicked \`${member.user.globalName}\`\nCouldn't send a DM to the user.`);
				});

				await member.kick(reason);
				await i.update({ embeds: [embed], components: [] });
			} else if (i.customId === 'cancel') {
				embed.setDescription(`Canceled the kick of \`${member.user.globalName}\``);
				embed.setColor("#5965ed");
				embed.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716772246171728/1395-finger-snapping.png");
				await i.update({ embeds: [embed], components: [] });
			}
		});

		collector.on('end', async collected => {
			if (collected.size === 0) {
				row.components[0].setDisabled(true);
				row.components[1].setDisabled(true);
				embed.setDescription(`Canceled the kick of \`${member.user.globalName}\`\n Nobody responded in time.`);
				embed.setColor("#5965ed");
				embed.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716772246171728/1395-finger-snapping.png");
				await interaction.editReply({ embeds: [embed], components: [row] });
			}
		});
	},
};
