const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mint")
    .setDescription("Mint xp to another user, admin command.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option.setName("target").setDescription("User being give xp").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("The amount given").setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.options.getInteger("amount") <= 0) {
      await interaction.reply({
        content: `You can't give a negative amount or zero.`,
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

    client.increaseXp(targetProfile, interaction.options.getInteger("amount"));
    await interaction.reply({
      content: `${interaction.user} minted ${interaction.options.getInteger(
        "amount"
      )} xp to ${interaction.options.getUser("target")}`,
    });
  },
};
