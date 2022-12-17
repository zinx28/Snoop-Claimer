const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const profileExport = require("../models/profileExport.js")
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const request = require("request");
module.exports = async (client) => {

	client.on("interactionCreate", async (interaction) => {
		// Slash Command Handling
		if (interaction.isCommand()) {
			await interaction.deferReply({ ephemeral: false }).catch(() => { });

			const cmd = client.slashCommands.get(interaction.commandName);
			if (!cmd)
				return interaction.followUp({ content: "An error has occured " });

			const args = [];

			for (let option of interaction.options.data) {
				if (option.type === "SUB_COMMAND") {
					if (option.name) args.push(option.name);
					option.options?.forEach((x) => {
						if (x.value) args.push(x.value);
					});
				} else if (option.value) args.push(option.value);
			}
			interaction.member = interaction.guild.members.cache.get(interaction.user.id);

			cmd.run(client, interaction, args);
		}
		if (interaction.isButton()) {
			//	await interaction.deferReply({ ephemeral: false });
			if (interaction.customId === "test") {
				const modal = new ModalBuilder()
					.setCustomId('myModal')
					.setTitle('Login to your epic games account');

				const epicInput = new TextInputBuilder()
					.setCustomId('epicInput')
					.setLabel("Whats your epic games auth?")
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const idk = new ActionRowBuilder().addComponents(epicInput);
				modal.addComponents(idk);
				await interaction.showModal(modal);
			}
			// Context Menu Handling

		}
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'myModal') {
				profileExport.findOne({
					discord: interaction.member.user.id
				}, async (err, Data) => {
					if (Data) {
						await interaction.reply({ content: "Adding more then on account is coming soon!", ephemeral: true })
					} else {
						const auth = interaction.fields.getTextInputValue('epicInput')
						var auth_request = {
							"url": "https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",
							"method": "POST",
							"headers": {
								'Content-Type': 'application/x-www-form-urlencoded',
								'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
							},

							form: {
								'grant_type': 'authorization_code',
								'code': auth,
							}
						}
						request(auth_request, async function(error, response) {
							const refresh_token = JSON.parse(response.body)['refresh_token']
							const accessToken = JSON.parse(response.body)['access_token']
							const accountId = JSON.parse(response.body)['account_id']
							const displayName = JSON.parse(response.body)['displayName']
							const errorMessage = JSON.parse(response.body)['errorMessage']
							const errorCode = JSON.parse(response.body)['errorCode']
							const row = new ActionRowBuilder();
							row.addComponents(new ButtonBuilder()
								.setLabel('Click me!')
								.setURL('https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code')
								.setStyle(ButtonStyle.Link)
							);
							if (errorCode == "errors.com.epicgames.account.oauth.authorization_code_not_for_your_client") {
								const embed = new EmbedBuilder()
									.setTitle("There was an error!")
									.setDescription(errorMessage)
									.setColor("Random")
									.setFooter({
										text: `${interaction.member.displayName}`
									})
									.setFooter({ text: interaction.member.user.username })
								return interaction.reply({ embeds: [embed], components: [row] })
							}
							if (errorCode == "errors.com.epicgames.account.oauth.authorization_code_not_found") {

								const embed = new EmbedBuilder()
									.setTitle("There was an error!")
									.setDescription(errorMessage)
									.setColor("Random")
									.setFooter({
										text: `${interaction.member.displayName}`
									})
									.setFooter({ text: interaction.member.user.username })
								return interaction.reply({ embeds: [embed], components: [row] })
							}
							if (displayName == undefined || displayName == "undefined") {
								return interaction.reply({ content: `Your username came as undefined` });
							}

							var device_request = {
								"url": `https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${accountId}/deviceAuth`,
								"method": "POST",
								"headers": {
									'Authorization': `bearer ${accessToken}`
								},
							}
							request(device_request, async function(error, response1) {
								const deviceId = JSON.parse(response1.body)['deviceId']
								const accountId1 = JSON.parse(response1.body)['accountId']
								const secret = JSON.parse(response1.body)['secret']

								let profile = await profileExport.create({
									"discord": interaction.member.user.id,
									"account": [{
										"createdAt": Date.now(),
										"displayName": displayName,
										"accountId": accountId1,
										"devicecode": deviceId,
										"refresh_token": refresh_token,
										"secret": secret
									}]
								})

								profile.save().catch(err => {
									console.log(err)
									return interaction.reply("There was an err: profile")
								})
								const embed = new EmbedBuilder()
									.setTitle(`Welcome, ${displayName}!`)
									.setDescription("If any commands doesnt work tell us!")
									.setFooter({
										text: `${interaction.member.displayName}`
									})
									.setColor("Random")
								return interaction.reply({ embeds: [embed] })
								//	interaction.update({ content: response2.body, ephemeral: true })
							})
						})
					}
				})
			}

			//username
		}
		if (interaction.isUserContextMenuCommand()) {
			await interaction.deferReply({ ephemeral: false });
			const command = client.slashCommands.get(interaction.commandName);
			if (command) command.run(client, interaction);
		}

	});

	client.on("messageCreate", async (message) => {
		//console.log(message.content)
		if (!message.author.bot) {
			if (message.channel.type == "dm" || message.content.toLowerCase().startsWith("!")) {
				//message.reply("Please refer to the slash commands -> <#1046867941704081578>")
			} else {
				return;
			}
		} else {
			return
		}
	});

}