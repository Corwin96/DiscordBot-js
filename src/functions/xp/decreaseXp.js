module.exports = (client) => {
  client.decreaseXp = async (profile, xpLost) => {
    profile.xp -= xpLost;
    profile.lastUpdated = new Date();
    await profile.save().catch(console.error);
  };
};
