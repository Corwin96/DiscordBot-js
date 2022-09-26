const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Embed,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marketplace")
    .setDescription("Return marketplace embed with buttons"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Titan Discord marketplace")
      .setDescription("Buy Titan tokens and other fun stuff")
      .addFields([
        {
          name: `Titan token`,
          value: `Price: 50,000 xp`,
          inline: true,
        },
        {
          name: `????`,
          value: `Price: 25,000 xp`,
          inline: true,
        },
      ]);
    const tokenbutton = new ButtonBuilder()
      .setCustomId("purchaseToken")
      .setLabel("Purchase a Titan token")
      .setStyle(ButtonStyle.Primary);

    const mysterybutton = new ButtonBuilder()
      .setCustomId("purchaseMystery")
      .setLabel("?????")
      .setStyle(ButtonStyle.Primary);

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(tokenbutton, mysterybutton)],
    });
  },
};
