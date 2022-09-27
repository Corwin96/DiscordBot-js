const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userID: { type: String },
  guildID: { type: String },
  xp: { type: Number, default: 0 },
  mysteryBox: { type: Number, default: 0},
  messageCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() },
});

module.exports = model("User", userSchema, "users");
