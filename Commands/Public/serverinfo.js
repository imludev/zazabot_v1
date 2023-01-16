const { channel } = require("diagnostics_channel");
const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Give server info"),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        const serverName = interaction.guild.name;
        const serverID = interaction.guild.id;
        const memberCount = interaction.guild.memberCount;
        const allMembers = interaction.guild.members.cache;
        const allEmojis = interaction.guild.emojis;
        const allStickers = interaction.guild.stickers;

        const servername = interaction.guild.name;
        const allRoles = interaction.guild.roles.cache;
        const serverOwnerID = interaction.guild.ownerId;
        const boostTier = interaction.guild.premiumTier;
        const boostCount = interaction.guild.premiumSubscriptionCount;

        const allChannels = interaction.guild.channels.cache;
        const allChannelsNoTH = interaction.guild.channels.channelCountWithoutThreads;




        let botinfoEmbed = new EmbedBuilder()
            .setAuthor({ name: servername })
            .setColor("#72008E")
            .setTitle("Bot info")
            .addFields({
                name: `Total Members`,
                value: `${memberCount}`,
                inline: true,
                // }, {
                //     name: `Users`,
                //     value: `${allMembers.filter(user => !user.bot).size}`,
                //     inline: true,
                // }, {
                //     name: `Bots`,
                //     value: `${allMembers.filter(user => user.bot).size}`,
                //     inline: true,
            }, {
                name: `Emojis`,
                value: `${allEmojis.cache.size.toString()} emojis, ${allStickers.cache.size.toString()} stickers`,
                inline: true,
            }, {
                name: `Roles`,
                value: `${allRoles.size.toString()}`,
                inline: true,
            }, {
                name: `Server owner`,
                value: `<@${serverOwnerID}>, ${serverOwnerID}`,
                inline: true,
            }, {
                name: `Boost tier`,
                value: `${boostTier}`,
                inline: true,
            }, {
                name: `Boosters`,
                value: `${boostCount}`,
                inline: true,
            }, {
                name: `Channel count`,
                value: `${allChannels.size.toString()} channels`,
                inline: true,
            })

            .setFooter({ text: `Server Name: ${serverName.toString()} | Server ID: ${serverID}` });

        interaction.reply({
            embeds: [botinfoEmbed]
            // , ephemeral: true
        });
    }
}