module.exports = {
  data: {
    name: `purchaseToken`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You just purchased a Titan token!`,
    });
  },
};
