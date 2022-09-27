const { SlashCommandBuilder } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("openmysterybox")
    .setDescription("Opens a mystery box for a reward!"),
  async execute(interaction, client) {
    let userProfile = await User.findOne({ userID: interaction.user.id });
    if (userProfile.mysteryBox < 1) {
      await interaction.reply({
        content: `You don't have a mystery box to open!`,
        ephemeral: true,
      });
      return;
    }
    userProfile.mysteryBox -= 1;
    const randValue = Math.floor(Math.random() * 1_000_000);
    if (randValue === 1_000_000) {
      await interaction.reply({
        content: `Congratulations ${interaction.user}, you won the jackpot of 500,000 xp!`,
      });
      userProfile.xp += 500_000;
    } else if (randValue < 1_000) {
      await interaction.reply({
        content: `Your mystery box suddenly explodes and nothing is left!`,
      });
    } else {
      const reward1 = Math.floor(Math.random() * 25_000);
      const reward2 = Math.floor(Math.random() * 25_000);
      if (reward1 + reward2 > 25_000) {
        await interaction.reply({
          content: `Congratulations, your mystery box spoils contain a burst of ${reward1} and one of ${reward2} xp!`,
        });
      } else {
        await interaction.reply({
          content: `Too bad, your mystery box only contains a total of ${reward1 + reward2} xp.`,
        });
      }
      userProfile.xp += reward1 + reward2;
    }
    await userProfile.save().catch(console.error);
  },
};
