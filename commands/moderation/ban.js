const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user from the server.')
		.setDescriptionLocalizations({
			nl: 'Ban een gebruiker van de server.'
		})
		.addUserOption(option => option
			.setName('user')
			.setDescription("The user to ban.")
			.setDescriptionLocalizations({
				nl: 'De gebruiker die verbannen moet worden.'
			})
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription("The reason why the user is banned.")
			.setDescriptionLocalizations({
				nl: 'De reden waarom de gebruiker verbannen wordt.'
			})
			.setRequired(false)
		)
	    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
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
			errorembed.setDescription("The user you tried to ban is not in the server.");
			return interaction.editReply({ embeds: [errorembed] });
		}

		if (!member.bannable) {
			errorembed.setDescription("The bot doesn't have the permission to ban this user.");
			return interaction.editReply({ embeds: [errorembed] });
		}

		if (member.id === interaction.user.id) {
			errorembed.setDescription("The bot can't ban you because your amazing.");
			return interaction.editReply({ embeds: [errorembed] });
		}

		let embed = new EmbedBuilder()
			.setColor("#FF0000")
			.setTitle("Ban")
			.setDescription(`Are you sure you want to kick \`${member.user.globalName}\`?`)
			.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148714658564415488/6426-error.png")
			.setTimestamp();

		let button = new ButtonBuilder()
			.setCustomId('ban')
			.setLabel('Ban')
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
			if (i.customId === 'ban') {
				embed.setDescription(`Successfully banned \`${member.user.globalName}\`\nUser has received a DM about the ban.`);
				embed.setColor("#26ae88");
				embed.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716657393532968/1697_Success_512x512_by_DW.png");

				let kickembed = new EmbedBuilder()
					.setColor("#5965ed")
					.setTitle("Banned")
					.setDescription(`You have been banned from the Xaroz discord.\nIt isn't possible to join again. \n\n If you think this is a mistake, you can appeal your ban by contacting us on contact@xaroz.net`)
					.addFields(
						{ name: "Reason", value: reason, inline: true },
						{ name: "Moderator", value: i.user.globalName, inline: true }
					)
					.setTimestamp();

				await member.send({ embeds: [kickembed] }).catch(() => {
					embed.setDescription(`Successfully banned \`${member.user.globalName}\`\nCouldn't send a DM to the user.`);
				});

				await member.kick(reason);
				await i.update({ embeds: [embed], components: [] });
			} else if (i.customId === 'cancel') {
				embed.setDescription(`Canceled the ban of \`${member.user.globalName}\``);
				embed.setColor("#5965ed");
				embed.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716772246171728/1395-finger-snapping.png");
				await i.update({ embeds: [embed], components: [] });
			}
		});

		collector.on('end', async collected => {
			if (collected.size === 0) {
				row.components[0].setDisabled(true);
				row.components[1].setDisabled(true);
				embed.setDescription(`Canceled the ban of \`${member.user.globalName}\`\n Nobody responded in time.`);
				embed.setColor("#5965ed");
				embed.setThumbnail("https://cdn.discordapp.com/attachments/1144740574734340177/1148716772246171728/1395-finger-snapping.png");
				await interaction.editReply({ embeds: [embed], components: [row] });
			}
		});
	},
};
