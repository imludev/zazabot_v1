const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");;
const BanDatabase = require("../../Schemas/Moderation/Bans");
const config = require("../../config.json");
const { botOwnerid, servOwnerId, supportRoleID } = require("../../variables")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("target")
            .setDescription("Select the user.")
            .setRequired(true))
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Enter a reason.")
            .setMaxLength(512)
        )
    ,
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, member } = interaction;

        const target = options.getMember("target");
        const duration = options.getString("duration")
        const reason = options.getString("reason") || "No reason specified."
        // const supportRoleID = config.server.roles.support.toString();

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not Ban a member due to", })
            .setColor("Red");
        if (interaction.user.id != supportRoleID || interaction.user.id != servOwnerId) {
            interaction.reply("You cannot preform this action.")
        } else if (interaction.user.id == supportRoleID || interaction.user.id == servOwnerId) {
            if (!target) return interaction.reply({
                embeds: [errorsEmbed.setDescription("Member has most likely left the guild.")]
            }).catch(error => {
                console.log(error)
            });;


            if (!target.Banable || !target.manageable || !target.moderatable)
                errorsArray.push("Slected member cannot be moderated by this bot.")

            if (member.roles.highest.position < target.roles.highest.position)
                errorsArray.push("Selected member has a higher role than you do.")

            if (errorsArray.length) {
                return interaction.reply({
                    embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                    ephemeral: true
                }).catch(error => {
                    console.log(error)
                });
            }
            const newInfractionsObject = {
                IssuerID: member.id,
                IsssuerTag: member.user.tag,
                Reason: reason,
                Date: Date.now()
            }

            let userData = await BanDatabase.findOne({
                Guild: guild.id,
                User: target.id
            });
            if (!userData)
                userData = await BanDatabase.create({
                    Guild: guild.id,
                    User: target.id
                })
            else {
                userData.Bans.push(newInfractionsObject) && await userData.save().catch(error => {
                    console.log(error)
                });
            }
            const successEmbed = new EmbedBuilder()
                .setAuthor({ name: "Ban issues", iconURL: guild.iconURL() })
                .setColor('Green')
                .setDescription([
                    `${target} was issued a Ban, \nbringing their infractions total to ** ${userData.Bans.length}**.\nReason: ${reason} `
                ].join("\n\n"));

            interaction.reply({
                embeds: [successEmbed],
            }).catch(error => {
                console.log(error)
            });

            target.Ban(reason).catch((err) => {
                console.log(err);
                interaction.reply({
                    embeds: [errorsEmbed.setDescription("Could not Ban user due to an uncommon error.")]
                })
            });
        }
    }
}
