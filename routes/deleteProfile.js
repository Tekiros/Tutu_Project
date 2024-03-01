const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const verifyToken2 = require('./JS/verifyTokenProfessor.js');
const Professor = require('../professorSchema.js');

router.get('/delete/professor/:professorId', verifyToken, verifyToken2, async (req,res)=>{
  try{
    const professorId = req.params.professorId;
    await Professor.findByIdAndDelete(professorId);

    req.flash('success', 'Usuário excluído com sucesso.');
    return res.redirect('/auth/gerenciadorUsuarios')
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao excluir o usuário.');
    return res.redirect('/');
  }
});

module.exports = router;