const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const verifyToken2 = require('./JS/verifyTokenProfessor.js');
const verifyPerfilSecretaria = require('./JS/verifyProfileSecretaria.js');
const Aluno = require('../alunosSchema.js');

router.get('/:id/deleteAluno', verifyToken, verifyPerfilSecretaria, verifyToken2, async (req,res)=>{
  try{
    const alunoId = req.params.id;
    await Aluno.findByIdAndDelete(alunoId);

    req.flash('success', 'Aluno(a) excluído com sucesso.');
    return res.redirect('/auth/gerenciadorUsuarios')
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao excluir o aluno.');
    return res.redirect('/');
  }
});

module.exports = router;