const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../../config.json")
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("leaveguild")
        .setDescription("View all the servers.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => (
            option.setName("id")
                .setDescription("Enter an guild ID")
        ))
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const guildID = interaction.options.getString("id") ?? interaction.guild.id
        const botOwnerid = config.botowner.id.toString();
        const servOwnerId = config.server.owner.id.toString();
        if (interaction.user.id != ownerId || interaction.user.id != servOwnerId) {            
            interaction.reply("You are not allowed to do that!")
        }
        else if (interaction.user.id == botOwnerid || interaction.user.id == servOwnerId) {
            client.guilds.cache.get(guildID).leave().then(guild =>
                interaction.reply({ content: `I left ${guild} (${guildID}) successfully`, ephemeral: true }))

        }
        else {
            interaction.reply("Mweh, I have an error.")
        }

    }
}
