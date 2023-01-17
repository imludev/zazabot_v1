const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, Client } = require("discord.js");;
const jsonconfig = require("../../config.json");
const variables = require("../../variables.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purge an amount of messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(options => options
            .setName("amount")
            .setDescription("Message amount")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {

        const amount = interaction.options.getInteger("amount");
        const modLogCH = client.channels.cache.get(jsonconfig.server.channels.modLogChannel);
        const msgLogCH = client.channels.cache.get(jsonconfig.server.channels.messageLogChannel);

        var embed = new EmbedBuilder()
            .setAuthor({ name: `Purge | ${jsonconfig.server.name}`, iconURL: interaction.user.avatarURL() })
            .setColor("DarkBlue")
            .setTitle("Purge")
            .setFields(
                { name: `Amount`, value: `${amount.toString()}`, inline: false },
                { name: `By:`, value: `${interaction.user.id}`, inline: false },

            )
            .setTimestamp();
        interaction.channel.bulkDelete(amount)
        interaction.reply({
            embeds: [embed],
            ephemeral: true

        })
            .then(() => {
                modLogCH.send({
                    embeds: [embed],
                }).catch((err) => {
                    console.log(err)
                    console.warn(`\n\n\n\n--- COULDNT SEND LOG MESSAGE OF PURGE TO MODLOG ---\n- Amount: ${amount}\n-By: ${interaction.user.id}`)
                })
            })
            .then(() => {
                msgLogCH.send({
                    embeds: [embed],
                }).catch((err) => {
                    console.log(err)
                    console.warn(`\n\n\n\n--- COULDNT SEND LOG MESSAGE OF PURGE TO MESSAGE LOGS ---\n- Amount: ${amount}\n-By: ${interaction.user.id}`)
                })
            })
            .then(() => {
                setTimeout(() => {
                    interaction.deleteReply()
                }, 5 * 1000);
            })

    }
}