const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, client) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message: ", error);
        return;
      }
    }
    if (reaction.message.author.bot) return;
    if (reaction.message.channel.type === 1) return;
    if (reaction.emoji.name === "💯") {
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
        userProfile.xp += 100;
        await userProfile.save().catch(console.error);
      }
    }
  },
};
