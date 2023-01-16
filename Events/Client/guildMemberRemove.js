const { ChatInputCommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(member, client) {
        let welcomeEmbed2 = new EmbedBuilder({
            author: { name: member.name, icon_url: member.avatarURL() }
        });
        let leftEmbed = new EmbedBuilder()
            .setAuthor({ name: member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL})
            .setColor("DarkBlue")
            .setTitle("Member left")
            .setFields(
                {name:`Member left`, value: `Goodbye, ${member.name}`},
            )
            .setThumbnail(member.avatarURL())
            .setFooter({text:`${member.name} left at `, iconURL: member.avatarURL()})
            .setFooter();
            ;
        const leaveCh = client.channels.fetch(jsonconfig.server.channels.leaveChannel);
        leaveCh.send({ embeds: [leftEmbed] }).catch(console.error)

    }
}