const mongoose = require('mongoose');

const historicoChatSchema = new mongoose.Schema({
    professor: {type:String, require:true},
    mensagem: {type:String, require:true},
    createdAt: {type:Date, default:Date.now},
});

const HistoricoChat = mongoose.model('HistoricoChat', historicoChatSchema);

module.exports = HistoricoChat;