const { Client, ActionRowBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, MessageAttachment, ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const profileExport = require("../../models/profileExport.js")
const request = require("request")
module.exports = {
    name: "claim",
    description: "claim stuff",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'option',
        description: 'Guff',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [{
            name: "guff",
            description: "claim guff",
            type: 'CHAT_INPUT',
            value: "Guff",
        }]
    }],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
       // await interaction.deferReply({ ephemeral: false }).catch((err) => { interaction.followUp({ content: `BOT ERROR ${err}` }) });
        const nameomg = interaction.options.getString("option")
        profileExport.findOne({
            discord: interaction.member.user.id
        }, (err, Data) => {
            if (!Data) {
                console.log("user not logged in")
                const embed = new EmbedBuilder()
                .setTitle(`Error`)
                .setDescription(`Your Not Logged IN!`)

                .setColor("Random");
            interaction.followUp({ embeds: [embed] })
            return
            } else {
                const embed = new EmbedBuilder()
                    .setTitle(`Checking Account Account!`)
                    .setDescription(`Checking If Account Data Is Correct`)

                    .setColor("Random");
                interaction.followUp({ embeds: [embed] })
                var token_request = {
                    "url": `https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token`,
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=`
                    },
                    //  "body": "{}",
                    form: {
                        'grant_type': 'device_auth',
                        'account_id': Data.account[0]["accountId"],
                        'device_id': Data.account[0]["devicecode"],
                        'secret': Data.account[0]["secret"]
                    },
                }
                request(token_request, async function (error, response1) {

                    //nameomg
                    const accessToken = JSON.parse(response1.body)['access_token']
                    if(nameomg == "Guff"){
                        const embed = new EmbedBuilder()
                        .setTitle(`Checking Account Account!`)
                        .setDescription(`Grabbing Account Data`)

                        .setColor("Random");
                    interaction.editReply({ embeds: [embed] })
                    console.log(accessToken)
                    console.log(Data.account[0]["accountId"])
                    var auth_request = {
                        "url": `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${Data.account[0]["accountId"]}/client/QueryProfile?profileId=athena&rvn=-1`,
                        "method": "POST",
                        "headers": {
                            'Content-Type': 'application/json',
                            'Authorization': `bearer ${accessToken}`
                        },
                        'body': '{}'
                    }
                    request(auth_request, async function (error, response2) {
                        const epics = JSON.parse(response2.body)
                        console.log(epics)
                        //	console.log(epics["notifications"][0]["items"])
                        if (epics["errorCode"] != undefined) {
                            if (epics['errorCode'] == 'errors.com.epicgames.common.authentication.token_verification_failed') {
                                const embed = new EmbedBuilder()
                                    .setTitle(`Error while verification!`)
                                    .setDescription(`Your account failed`)
                                    .setColor("Random")
                                return interaction.followUp({ embeds: [embed], ephemeral: true })
                            } else {
                                const embed = new EmbedBuilder()
                                    .setTitle(`Error while Claiming!`)
                                    .setDescription(`${epics["errorMessage"]}`)
                                    .setColor("Random")
                                return interaction.followUp({ embeds: [embed], ephemeral: true })
                            }

                        } else {
                            console.log("e")
                            try {
                                let arrayidk = []
                                const items = epics['profileChanges'][0]['profile']['items'];
                                console.log("d")
                                let rewardGraphId;
                                for (const item in items) {
                                    
                                    if (items[item].templateId === "AthenaRewardGraph:s23_winterfest") {
                                        console.log(items[item])
                                        rewardGraphId = item;
                                    } 
                                    //else {
                                       // const embed = new EmbedBuilder()
                                        //    .setTitle(`Error!`)
                                       //     .setDescription(`Seems like the reward is no longer available`)
                                      //      .setColor("Random");
                                    //    return interaction.editReply({ embeds: [embed] })
                                  //  }
                                };
 
                                var auth_request = {
                                    "url": `https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${Data.account[0]["accountId"]}/client/UnlockRewardNode?profileId=athena&rvn=-1`,
                                    "method": "POST",
                                    "headers": {
                                        'Content-Type': 'application/json',
                                        'Authorization': `bearer ${accessToken}`
                                    },
                                    'body': JSON.stringify({
                                        nodeId: "ERG.Node.B.1",
                                        rewardGraphId: rewardGraphId,
                                        rewardCfg: ""
                                    })
                                }
                                request(auth_request, async function (error, response2) {
                                    if (epics["errorCode"] != undefined) {
                                        console.log(epics["errorCode"])

                                        const embed = new EmbedBuilder()
                                        .setTitle(`Error!`)
                                        .setDescription(`Unknown error`)
                                        .setColor("Random");
                                    return interaction.editReply({ embeds: [embed] })
                                    }else{
               
                                            const embed = new EmbedBuilder()
                                            .setTitle(`Claimed Guff!`)
                                            .setDescription(`If you didnt get guff then make sure you have at least one unclaimed present left`)
                                            .setColor("Random");
                                        return interaction.editReply({ embeds: [embed] })
                                        
                                     
                                    }
                                })
                                //if (epics["notifications"][0]["items"].length == arrayidk.length) {
                                //	const embed = new EmbedBuilder()
                                ///	.setTitle(`You've already claimed your Daily Reward!`)
                                ///		.setDescription(`Days Logged In: ${epics["notifications"][0]["daysLoggedIn"]}`)
                                //		.setColor("Random");
                                //	return interaction.followUp({ embeds: [embed] })
                                //} else {


                            } catch (err) {
                                const embed = new EmbedBuilder()
                                    .setTitle(`Error!`)
                                    .setDescription(`Seems like theres a random error`)
                                    .setColor("Random");
                                return interaction.editReply({ embeds: [embed] })
                            }
                            console.log(epics["profileChanges"][0]["profile"]["stats"]["attributes"]["level"])
                            //console.log(epics)

                            //	}
                        }

                        //	console.log(epics["profileChanges"][0]["profile"]["stats"]["attributes"]["homebase_name"])

                    })
                    }else{
                        const embed = new EmbedBuilder()
                        .setTitle(`fd!`)
                        .setDescription(`Wrong Option`)
                        .setColor("Random");
                    return interaction.editReply({ embeds: [embed] })
                    }
                   
                })
            }
        })

    }
}