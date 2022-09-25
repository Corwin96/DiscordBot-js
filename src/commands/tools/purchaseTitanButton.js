const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purchasetitanbutton")
    .setDescription("Return Titan purchase button"),
  async execute(interaction, client) {
    const button = new ButtonBuilder()
      .setCustomId("purchaseToken")
      .setLabel("Purchase a Titan token")
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};
