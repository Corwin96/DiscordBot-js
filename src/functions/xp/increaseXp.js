module.exports = (client) => {
  client.increaseXp = async (profile, xpGained) => {
    profile.xp += xpGained;
    profile.lastUpdated = new Date();
    await profile.save().catch(console.error);
  };
};
