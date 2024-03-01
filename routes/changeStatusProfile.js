const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken');
const verifyTokenProfile = require('./JS/verifyTokenProfile');
const Professor = require('../professorSchema');

router.get('/changeStatus/professor/:professorId', verifyToken, verifyTokenProfile, async (req,res)=>{
  try{
    const professorId = req.params.professorId;
    const professor = await Professor.findById(professorId);

    if(professor.status == true){
      professor.status = false;
    }else{
      professor.status = true;
    }

    await professor.save();

    return res.redirect('/auth/gerenciadorUsuarios')
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao alterar o status do usuário.');
    return res.redirect('/');
  }
});

module.exports = router;