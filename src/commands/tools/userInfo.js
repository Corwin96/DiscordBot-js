const { SlashCommandBuilder } = require("discord.js");
const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Return user xp from a database!"),
  async execute(interaction, client) {
    let userProfile = await User.findOne({ userID: interaction.user.id });
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userID: interaction.user.id,
        xp: 0,
        messageCount: 0,
      });

      await userProfile.save().catch(console.error);
      await interaction.reply({
        content: `User xp: ${userProfile.xp}\nMystery boxes: ${userProfile.mysteryBox}\nLast message: ${userProfile.lastUpdated}`,
      });
    } else {
      await interaction.reply({
        content: `User xp: ${userProfile.xp}\nMystery boxes: ${userProfile.mysteryBox}\nLast message: ${userProfile.lastUpdated}`,
      });
      console.log(userProfile);
    }
  },
};
