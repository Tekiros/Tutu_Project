const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token:{
    type: String,
    required: true,
    unique: true,
  },
  expireAt:{
    type: Date,
    default: Date.now,
    index: {expires: '1d'},
  },
});

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);

module.exports = BlacklistToken;