const { SlashCommandBuilder } = require("discord.js");
const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tip")
    .setDescription("Tip xp to another user!")
    .addUserOption((option) =>
      option.setName("target").setDescription("User being tipped").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("The amount tipped").setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.options.getInteger("amount") <= 0) {
      await interaction.reply({
        content: `You can't tip a negative amount or zero.`,
      });
      return;
    }
    if (interaction.options.getUser("target") === interaction.user) {
      await interaction.reply({
        content: `You can't tip yourself.`,
      });
      return;
    }
    let userProfile = await User.findOne({ userID: interaction.user.id });
    let targetProfile = await User.findOne({ userID: interaction.options.getUser("target").id });
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userID: interaction.user.id,
        xp: 0,
        messageCount: 0,
      });

      await userProfile.save().catch(console.error);
      await interaction.reply({
        content: `You don't have any xp yet`,
      });
    } else {
      if (userProfile.xp < interaction.options.getInteger("amount")) {
        await interaction.reply({
          content: `You don't have enough to tip that much!`,
        });
        return;
      }
      if (!targetProfile) {
        targetProfile = await new User({
          _id: mongoose.Types.ObjectId(),
          userID: interaction.options.getUser("target").id,
          xp: 0,
          messageCount: 0,
        });
        await targetProfile.save().catch(console.error);
      }
      client.decreaseXp(userProfile, interaction.options.getInteger("amount"));
      client.increaseXp(targetProfile, interaction.options.getInteger("amount"));
      await interaction.reply({
        content: `${interaction.user} tipped ${interaction.options.getUser(
          "target"
        )} ${interaction.options.getInteger("amount")} xp`,
      });
    }
  },
};
