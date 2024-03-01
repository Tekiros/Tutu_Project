const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken');
const verifyTokenProfile = require('./JS/verifyTokenProfile');
const Aluno = require('../alunosSchema');

router.get('/changeStatus/aluno/:alunoId', verifyToken, verifyTokenProfile, async (req,res)=>{
  try{
    const alunoId = req.params.alunoId;
    const aluno = await Aluno.findById(alunoId);

    if(aluno.status == true){
      aluno.status = false;
    }else{
      aluno.status = true;
    }

    await aluno.save();

    return res.redirect('/auth/gerenciadorUsuarios')
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao alterar o status do usuário.');
    return res.redirect('/');
  }
});

module.exports = router;