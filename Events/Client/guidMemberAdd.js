const { ChatInputCommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
const jsonconfig = require("../../config.json");
module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(member, client) {
        let welcomeEmbed2 = new EmbedBuilder({
            author: { name: member.name, icon_url: member.avatarURL() }
        });
        let welcomeEmbed = new EmbedBuilder()
            .setAuthor({ name: member.user.username + " | " + jsonconfig.server.name, iconURL: jsonconfig.server.iconURL})
            .setColor("DarkBlue")
            .setTitle("New member")
            .setFields(
                {name:`New member joined`, value: `Welcome, ${member.name}`},
                {name:"Please make sure to:", value:`\t- Read the rules in <#${jsonconfig.server.channels.rulesChannel}>\n\t- Be nice to eachother\n\t- Have fun!`}
            )
            .setThumbnail(member.avatarURL())
            .setFooter({text:`${member.name} joined at `, iconURL: member.avatarURL()})
            .setFooter();
            ;
        const welcomeCh = client.channels.fetch(jsonconfig.server.channels.welcomeChannel);
        welcomeCh.send({ embeds: [welcomeEmbed] }).catch(console.error)

    }
}