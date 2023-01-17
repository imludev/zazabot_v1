const { ChatInputCommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    execute(member, client) {
        let welcomeEmbed2 = new EmbedBuilder({
            author: { name: member.name, icon_url: member.avatarURL() }
        });
        let leftEmbed = new EmbedBuilder()
            .setAuthor({ name: member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL })
            .setColor("DarkBlue")
            .setFields(
                { name: `Member left`, value: `Goodbye, ${member.user.username}` },
            )
            .setThumbnail(member.avatarURL())
            .setFooter({ text: ` ${member.user.username} left at `, iconURL: member.avatarURL() })
            .setTimestamp();

        const leaveCh = client.channels.cache.get(jsonconfig.server.channels.leaveChannel);
        leaveCh.send({ embeds: [leftEmbed] }).catch(console.error)

    }
}