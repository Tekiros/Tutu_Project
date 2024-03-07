const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('./JS/verifyToken.js');
const Aluno = require('../alunosSchema.js');
const Professor = require('../professorSchema.js');


router.get('/registerAluno', verifyToken, async (req,res)=>{
  const user = await Professor.findById(req.user.id, '-password');

  res.render('registerAluno', {user:user});
});
  
router.post('/registerAluno', verifyToken, async (req,res)=>{
  const {name, surname, id_aluno} = req.body;
  const alunoExist = await Aluno.findOne({id_aluno:id_aluno});

  if(!name){
    req.flash('error', 'Você precisa preencher o campo "Nome".');
    return res.redirect('/auth/registerAluno');
  }
  if(!surname){
    req.flash('error', 'Você precisa preencher o campo "Sobrenome".');
    return res.redirect('/auth/registerAluno');
  }
  if(!id_aluno){
    req.flash('error', 'O identificado do aluno(a) e obrigatório');
    return res.redirect('/auth/registerAluno');
  }
  
  if(alunoExist){
    req.flash('error', 'Esse aluno(a) já está cadastrado');
    return res.redirect('/auth/registerAluno');
  }

  const aluno = new Aluno({
    _id: new mongoose.Types.ObjectId(),
    name,
    surname,
    id_aluno,
    comments: [],
  });

  try{
    await aluno.save();
    req.flash('success', 'Aluno(a) cadastrado com sucesso');
    return res.redirect('/auth/registerAluno');
  }catch(err){
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde // Esse aluno(a) já pode estar cadastrado');
    return res.redirect('/auth/registerAluno');
  }
});

module.exports = router;