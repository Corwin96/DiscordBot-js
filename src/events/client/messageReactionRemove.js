const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  name: "messageReactionRemove",
  async execute(reaction, client) {
    if (reaction.message.author.bot) return;
    if (reaction.message.channel.type === 1) return;
    if (reaction.emoji === "💯") {
      let userProfile = await User.findOne({ userID: reaction.message.author.id });
      await client.decreaseXp(userProfile, 100);
    }
  },
};
