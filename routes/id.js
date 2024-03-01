const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Aluno = require('../alunosSchema.js');
const Professor = require('../professorSchema.js');


router.get('/:id', verifyToken, async (req,res)=>{
  const {id} = req.params

  professor = await Professor.findById(req.user.id, '-password').then(async (user)=>{
    try{
      const alunoId = await Aluno.findById(id);
      const comments = alunoId.comments;
      
      if(!alunoId){
        req.flash('error', 'Aluno não encontrado');
        return res.redirect(`/${id}`);
      }
      
      if(alunoId.status == false){
        return res.redirect('/?busca=')
      }

      return res.render('single', {alunoId:alunoId, comments:comments, user:user});
      
    }catch(error){
      req.flash('error', 'Erro ao buscar aluno(a)');
      return res.redirect('/');
    }
  });
});

module.exports = router;