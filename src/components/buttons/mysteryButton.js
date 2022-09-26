module.exports = {
  data: {
    name: `purchaseMystery`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You just purchased a mystery box!`,
    });
  },
};