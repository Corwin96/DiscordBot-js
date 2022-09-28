const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    if (message.channel.type === 1) return;
    let userProfile = await User.findOne({ userID: message.author.id });
    const date = new Date();
    const xpGained = Math.floor(Math.random() * (500 - 100) + 100);
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userID: message.author.id,
        xp: xpGained,
        messageCount: 1,
        lastUpdated: date,
      });

      await userProfile.save().catch(console.error);
    } else {
      if ((date - new Date(userProfile.lastUpdated)) < 60_000) return;
      userProfile.messageCount++;
      userProfile.lastUpdated = date;
      await client.increaseXp(userProfile, xpGained);
    }
  },
};
