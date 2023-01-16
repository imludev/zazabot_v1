const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const pckg = require("../../package.json");
const confg = require("../../config.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Give bot info"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        const allUsers = client.users.cache;
        const allServers = client.guilds.cache;
        const allChannels = client.channels.cache;
        const allMembers = interaction.guild.members.cache;


        let botinfoEmbed = new EmbedBuilder()
            .setColor("#72008E")
            .setTitle("Bot info")
            // .setDescription(``)
            .addFields(

                {
                    name: `Bot version`,
                    value: `${pckg.version}`,
                    inline: true
                },
                {
                    name: `Node version`,
                    value: `v19.1.0`,
                    inline: true
                },

                {
                    name: `Discord.js version`,
                    value: `${pckg.dependencies["discord.js"]}`,
                    inline: true
                },
                {
                    name: `Made by`,
                    value: `[${confg.owner.name}](https://discord.com/users/${confg.owner.id})`,
                    inline: false
                },
                // {
                //     name: ``,
                //     value: ``,
                //     inline: false
                // },
                // {
                //     name: ``,
                //     value: ``,
                //     inline: false
                // },


            )

        interaction.reply({
            content: `Not available yet.`, embeds: [botinfoEmbed]
        });
    }
}