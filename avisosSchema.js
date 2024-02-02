const mongoose = require('mongoose');

const avisosSchema = new mongoose.Schema({
  text : {type:String, require:true},
  author: {type: String, required: true},
  authorId: {type: String, require: true},
  createdAt: {type: Date, default: Date.now},
  expireAt:{
    type: Date,
    default: Date.now,
    index: {expires: '10d'},
  },
});

avisosSchema.methods.getFormattedDate = function(){
  return this.createdAt.toLocaleString('pt-BR');
};

var Avisos = mongoose.model('Avisos', avisosSchema);

module.exports = Avisos;