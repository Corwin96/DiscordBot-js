module.exports = {
  data: {
    name: `purchaseMystery`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `${interaction.user}, you just purchased a mystery box!`,
    });
  },
};