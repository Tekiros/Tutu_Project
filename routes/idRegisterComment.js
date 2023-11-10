const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const Aluno = require('../alunosSchema.js');
const Notification = require('../notificationsSchema.js');


router.post('/:id/registerComment', verifyToken, async (req,res)=>{
  const {id} = req.params;
  const {commentText,commentTitle} = req.body;

  try{
    const aluno = await Aluno.findById(id);

    if(!aluno){
      req.flash('error', 'Aluno não encontrado');
      return res.redirect(`/${id}`);
    }

    const professor = await Professor.findById(req.user.id, '-password');

    if(!professor){
      req.flash('error', 'Professor não encontrado');
      return res.redirect(`/${id}`);
    }

    if(!commentTitle){
      req.flash('error', 'Você precisa adicionar um título ao comentário.');
      return res.redirect(`/${id}`);
    }

    if(!commentText){
      req.flash('error', 'Você precisa adicionar um comentário.');
      return res.redirect(`/${id}`);
    }

    aluno.comments.push({
      textTitle: commentTitle,
      text: commentText,
      author: professor.name,
    });

    await aluno.save();

    //////////////////////////////////////////////

    const notification = new Notification({
      text: `${professor.apelido} comentou sobre ${aluno.name} ${aluno.surname}.`,
      aluno: aluno._id,
    });

    await notification.save();

    req.flash('success', 'Comentário criado com sucesso.');
    res.redirect(`/${id}`);
  } catch(error){
    req.flash('error', 'Erro ao adicionar comentário');
    console.log(error);
    return res.redirect(`/${id}`);
  }
});

module.exports = router;