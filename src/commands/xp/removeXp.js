const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removexp")
    .setDescription("Remove xp from a user, admin command.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option.setName("target").setDescription("User where xp will be removed").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("The amount removed").setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.options.getInteger("amount") <= 0) {
      await interaction.reply({
        content: `You can't remove a negative amount or zero.`,
      });
      return;
    }

    let targetProfile = await User.findOne({ userID: interaction.options.getUser("target").id });

    if (!targetProfile) {
      targetProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userID: interaction.options.getUser("target").id,
        xp: 0,
        messageCount: 0,
      });
      await targetProfile.save().catch(console.error);
    }

    if (targetProfile.xp < interaction.options.getInteger("amount")) {
      targetProfile.xp = 0;
      await interaction.reply({
        content: `${interaction.options.getUser("target")} doesn't have that much xp, xp set to 0`,
      });
      await targetProfile.save().catch(console.error);
      return;
    }

    client.decreaseXp(targetProfile, interaction.options.getInteger("amount"));
    await interaction.reply({
      content: `${interaction.user} removed ${interaction.options.getInteger(
        "amount"
      )} xp from ${interaction.options.getUser("target")}`,
    });
  },
};
