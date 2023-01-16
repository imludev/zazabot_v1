const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");;
const kickDatabase = require("../../Schemas/Moderation/Kicks");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not kick a member due to", })
            .setColor("Red");

        if (!target) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Member has most likely left the guild.")]
        }).catch(error => {
            console.log(error)
        });


        if (!target.kickable || !target.manageable || !target.moderatable)
            errorsArray.push("Slected member cannot be moderated by this bot.")

        if (member.roles.highest.position < target.roles.highest.position)
            errorsArray.push("Selected member has a higher role than you do.")

        if (errorsArray.length)
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true
            }).catch(error => {
                console.log(error)
            });
        target.kick(reason).catch((err) => {
            interaction.reply({
                embeds: [errorsEmbed.setDescription("Could not kick user due to an uncommon error.")]
            })
        });

        const newInfractionsObject = {
            IssuerID: member.id,
            IsssuerTag: member.user.tag,
            Reason: reason || "No reason specified",
            Date: Date.now()
        }

        let userData = await kickDatabase.findOne({
            Guild: guild.id,
            User: target.id
        });
        if (!userData)
            userData = await kickDatabase.create({
                Guild: guild.id,
                User: target.id
            }).catch(error => {
                console.log(error)
            });
        else {
            userData.Kicks.push(newInfractionsObject) && await userData.save().catch(error => {
                console.log(error)
            });
        }
        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Kick issues", iconURL: guild.iconURL() })
            .setColor('Green')
            .setDescription([
                `${target} was kicked, \nbringing their kick total to ** ${userData.Kicks.length + 1}**.\nReason: ${reason} `
            ].join("\n\n"));

        return interaction.reply({
            embeds: [successEmbed],
        }).catch(error => {
            console.log(error)
        });

    }
}
