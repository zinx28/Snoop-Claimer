const { Client, ActionRowBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, MessageAttachment, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const EnableprofileExport = require("../../models/profileExport")
module.exports = {
	name: "logout",
	description: "Dev testing",
	type: ApplicationCommandType.ChatInput,

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
	//	await interaction.deferReply({ ephemeral: false }).catch((err) => { interaction.followUp({ content: `BOT ERROR ${err}` }) });

		  EnableprofileExport.findOne({
            discord: interaction.member.user.id
        }, (err, Data) => {
            if (!Data) {
 				interaction.followUp({ content: "Dont have a account to logout with!" });
			}else{
				EnableprofileExport.collection.findOneAndDelete({"discord": interaction.member.user.id})
				interaction.followUp({ content: "Account Deleted!" })
			}
			})

	}
}
