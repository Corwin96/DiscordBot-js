module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    await message.reply({
      content: `No u`,
    });
  },
};
