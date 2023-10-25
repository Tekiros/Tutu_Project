const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  text: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  aluno: {type:mongoose.Schema.Types.ObjectId, ref: 'Aluno' },
  expireAt:{
    type: Date,
    default: Date.now,
    index: {expires: '7d'},
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

