const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');


const Aluno = require('../alunosSchema.js');

router.get('/:id', verifyToken, async (req,res)=>{
    const {id} = req.params
  
    try{
      const alunoId = await Aluno.findById(id);
      const comments = alunoId.comments;
      
      if(!alunoId){
        req.flash('error', 'Aluno não encontrado');
        return res.redirect(`/${id}`);
      }
      res.render('single', {alunoId:alunoId, comments:comments});
    }catch(error){
      req.flash('error', 'Erro ao buscar aluno(a)');
      return res.redirect('/');
    }
});

module.exports = router;