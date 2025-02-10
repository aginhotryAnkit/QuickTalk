const mongo = require("mongoose");

const UserSchema = new mongo.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 20,
    unique: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  friends: [
    {
      type: mongo.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongo.model("Users", UserSchema);

module.exports = User;
