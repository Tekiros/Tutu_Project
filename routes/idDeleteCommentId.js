const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const Aluno = require('../alunosSchema.js');


router.get('/:id/delete/:commentId', verifyToken, async (req,res)=>{
  const{id, commentId} = req.params;
  const professor = await Professor.findById(req.user.id, '-password');

  try{
    const aluno = await Aluno.findById(id);

    if(!aluno){
      req.flash('error', 'Aluno não encontrado');
      return res.redirect('/');
    }

    const comment = aluno.comments.find(comment => comment._id.toString() === commentId);

    if(!comment){
      req.flash('error', 'Comentário não encontrado');
      return res.redirect(`/${id}`);
    }

    if(comment.author !== professor.name){
      req.flash('error', 'Você não tem permissão para excluir este comentário.');
      return res.redirect(`/${id}`);
    }

    aluno.comments.remove(comment);

    await aluno.save();

    req.flash('success', 'Comentário excluído com sucesso.');
    return res.redirect(`/${id}`);
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao excluir o comentário.');
    return res.redirect(`/${id}`);
  }
});

module.exports = router;