const { Client, ActionRowBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, MessageAttachment, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
	name: "login",
	description: "Dev testing",
	type: ApplicationCommandType.ChatInput,

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
	//	await interaction.deferReply({ ephemeral: true }).catch((err) => { interaction.followUp({ content: `BOT ERROR ${err}` }) });
		const discordId = interaction.member.user.id

		const row = new ActionRowBuilder();
		row.addComponents(new ButtonBuilder()
			.setCustomId('test')
			.setLabel('Click me!')
			.setStyle(ButtonStyle.Primary)
		);
		row.addComponents(new ButtonBuilder()
				.setLabel('Auth Link!')
				.setURL('https://www.epicgames.com/id/api/redirect?clientId=af43dc71dd91452396fcdffbd7a8e8a9&responseType=code&redirectUrl=eos.af43dc71dd91452396fcdffbd7a8e8a9://epic/auth')
				.setStyle(ButtonStyle.Link)
		);

		interaction.followUp({ content: `Login Test!`, components: [row], ephemeral: true })
	}
}