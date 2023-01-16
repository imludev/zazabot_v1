const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const jsonconfig = require("../../config.json")
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("fix")
        .setDescription("Fix the server & bot's name")
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((options) => options
            .setName("id")
            .setDescription("Enter bot owner's ID to continue")
            .setRequired(true)
        )
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const { options, guild, user, } = interaction;
        const botOwnerid = jsonconfig.botowner.id.toString();
        const servOwnerId = jsonconfig.server.owner.id.toString();
        const sentID = options.getString("id");
        if (interaction.user.id !== botOwnerid || interaction.user.id != servOwnerId) {
            interaction.reply(jsonconfig.messages.errors.moderation.noPerms)
        }
        else if (interaction.user.id == botOwnerid || interaction.user.id == servOwnerId) {
            if (sentID !== botOwnerid || sentID != servOwnerId) {
                interaction.reply(jsonconfig.messages.errors.rest.invalidInput)
            } else if (sentID == botOwnerid || sentID == servOwnerId) {
                client.user.edit({
                    username: jsonconfig.bot.name,
                    avatar: jsonconfig.bot.iconURL
                }).then( () => {
                    interaction.guild.edit({
                        name: jsonconfig.server.name,
                        icon: jsonconfig.server.iconURL,
                        banner:jsonconfig.server.bannerURL,
                        description: jsonconfig.server.description,
                        reason: `${user} ran the fix command.`
                    })
                // }).then(() =>{
                //     client.member.setNickname("ZazaBot")

                }).then(() => {
                    interaction.reply({
                        content:"Successfully fixed the server.",
                        ephemeral: true
                    })
                })

            } else {
                interaction.reply(jsonconfig.messages.errors.undefinedErr)

            }
        }
        else {
            reply(jsonconfig.messages.errors.undefinedErr)
        }

    }
}
