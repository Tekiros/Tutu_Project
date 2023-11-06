const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');


const Professor = require('../professorSchema.js');
const Aluno = require('../alunosSchema.js');


router.post('/:id/edit/:commentId', verifyToken, async (req,res)=>{
    const{id, commentId} = req.params;
    const professor = await Professor.findById(req.user.id, '-password');
    const {commentTitle, commentText} = req.body;
  
    try{
      const aluno = await Aluno.findById(id);
  
      if (!aluno){
        req.flash('error', 'Aluno não encontrado');
        return res.redirect('/');
      }
  
      var comment = aluno.comments.find(comment => comment._id.toString() === commentId);
  
      if (!comment){
        req.flash('error', 'Comentário não encontrado');
        return res.redirect(`/${id}`);
      }
  
      if(comment.author !== professor.name){
        req.flash('error', 'Você não tem permissão para excluir este comentário.');
        return res.redirect(`/${id}`);
      }
  
      comment.textTitle = commentTitle;
      comment.text = commentText +`
      (Comentário editado)
      `;
      comment.createdAt = new Date();
  
      await aluno.save();
  
      req.flash('success', 'Comentário editado com sucesso.');
      return res.redirect(`/${id}`);
    }catch(error){
      console.error(error);
      req.flash('error', 'Ocorreu um erro ao editar o comentário.');
      return res.redirect(`/${id}`);
    }
});

module.exports = router;