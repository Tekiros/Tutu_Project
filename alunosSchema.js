const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  textTitle: {type: String, require: true},
  text: {type: String, required: true},
  author: {type: String, required: true},
  authorId: {type: String, require: true},
  createdAt: {type: Date, default: Date.now},
});

commentSchema.methods.getFormattedDate = function(){
  return this.createdAt.toLocaleString('pt-BR');
};

const alunoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type:String, required:true},
  surname: {type:String, required:true},
  id_aluno: {type:String, required:true, unique:true},
  comments: [commentSchema], 
  status: {type: Boolean, default: true},
});

var Aluno = mongoose.model('Aluno', alunoSchema);

module.exports = Aluno;

