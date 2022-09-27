const User = require("../../schemas/user");

module.exports = {
  data: {
    name: `purchaseMystery`,
  },
  async execute(interaction, client) {
    let userProfile = await User.findOne({ userID: interaction.user.id });
    if (userProfile.xp < 25_000) {
      await interaction.reply({
        content: `You don't have enough xp for a mystery box (25,000)!`,
        ephemeral: true,
      });
      return;
    }
    client.decreaseXp(userProfile, 25_000);
    userProfile.mysteryBox += 1;
    await interaction.reply({
      content: `${interaction.user}, you just bought a mystery box`,
      ephemeral: true,
    });
  },
};