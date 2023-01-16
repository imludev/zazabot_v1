const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../../config.json")
module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("allguilds")
        .setDescription("View all the servers.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const botOwnerid = config.botowner.id.toString();
        const servOwnerId = config.server.owner.id.toString();

        if (interaction.user.id !== botOwnerid  || interaction.user.id != servOwnerId) {
            interaction.reply("You are not allowed to do that!")
        }
        else if (interaction.user.id == botOwnerid  || interaction.user.id == servOwnerId) {
            let embed = new EmbedBuilder()
                .setAuthor({ name: `Cuboid` })
                .setTitle("All guilds")
                .setDescription(`
                **THIS GUILD** 
                ${interaction.guild.name + "|" + interaction.guild.id}

                **ALL GUILDS**
                ${client.guilds.cache.map(m => `${m.name} | ${m.id}`).join("\n")}`)
            interaction.reply({
                content: "Here you go",
                ephemeral: true, embeds: [embed]
            })
        }
        else {
            interaction.reply("Mweh, I have an error.")
        }

    }
}
