const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, client) {
    if (reaction.message.author.bot) return;
    if (reaction.message.channel.type === 1) return;
    if (reaction.emoji === "💯") {
      let userProfile = await User.findOne({ userID: reaction.message.author.id });
      if (!userProfile) {
        userProfile = await new User({
          _id: mongoose.Types.ObjectId(),
          userID: reaction.message.author.id,
          xp: 100,
          messageCount: 0,
        });
        await userProfile.save().catch(console.error);
      } else {
        await client.increaseXp(userProfile, 100);
      }
    }
  },
};
