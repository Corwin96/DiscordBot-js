const User = require("../../schemas/user");
const mongoose = require("mongoose");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    let userProfile = await User.findOne({ userID: message.author.id });
    const xpGained = Math.floor(Math.random() * (500 - 100) + 100);
    if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userID: message.author.id,
        xp: xpGained,
        messageCount: 1,
      });

      await userProfile.save().catch(console.error);
      await message.reply({
        content: `You have been registered and awarded ${xpGained} xp`,
      });
    } else {
      await client.increaseXp(userProfile, xpGained);
      await message.reply({
        content: `You have been awarded ${xpGained} xp`,
      });
      console.log(userProfile);
    }
  },
};
