const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const verifyToken2 = require('./JS/verifyTokenEditProfile.js');
const Aluno = require('../alunosSchema.js');


router.get('/:id/editAluno', verifyToken, verifyToken2, async (req,res)=>{
  const {id} = req.params;
  const aluno = await Aluno.findById(id);

  res.render('editAluno', {aluno:aluno})
});

router.post('/:id/editAluno', verifyToken, verifyToken2, async (req,res)=>{
  const {name, surname, id_aluno} = req.body;
  const {id} = req.params;
  const aluno = await Aluno.findById(id);

  try{
    if(aluno.status == false){
      return res.redirect('/?busca=')
    }
    if(name == ''){
      req.flash('error', 'Você precisa preencher o campo "Nome".');
      return res.redirect(`/${id}/editAluno`);
    }
    if(surname == ''){
      req.flash('error', 'Você precisa preencher o campo "Sobrenome".');
      return res.redirect(`/${id}/editAluno`);
    }
    else if(id_aluno == ''){
      req.flash('error', 'O identificado do aluno(a) e obrigatório.');
      return res.redirect(`/${id}/editAluno`);
    }

    aluno.name = name;
    aluno.surname = surname;
    aluno.id_aluno = id_aluno;

    
    await aluno.save();

    req.flash('success', 'Dados atualizados com sucesso.');
    return res.redirect(`/${id}/editAluno`);

  }catch(err){
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde // Esse aluno(a) já pode estar cadastrado');
    return res.redirect(`/${id}/editAluno`);
  }
});

module.exports = router;