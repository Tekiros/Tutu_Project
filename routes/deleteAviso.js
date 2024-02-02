const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const verifyPerfilSecretaria = require('./JS/verifyProfileSecretaria.js');
const Professor = require('../professorSchema.js');
const Avisos = require('../avisosSchema.js');


router.get('/aviso/:avisoId/delete', verifyToken, verifyPerfilSecretaria, async (req,res)=>{
  const{avisoId} = req.params;
  const professor = await Professor.findById(req.user.id, '-password');
  const urlAnterior = req.get('referer');
  const redirecionarPara = urlAnterior && urlAnterior.indexOf('/aviso/') === -1 ? urlAnterior : '/';

  try{
    const aviso = await Avisos.findById(avisoId);
    
    if(!aviso){
      req.flash('error', 'Aviso não encontrado');
      return res.redirect('/auth/addAviso');
    }

    await Avisos.findByIdAndDelete(avisoId)

    // const comment = aluno.comments.find(comment => comment._id.toString() === commentId);

    // if(!comment){
    //   req.flash('error', 'Comentário não encontrado');
    //   return res.redirect('/addAviso');
    // }

    // if(comment.author !== professor.name){
    //   req.flash('error', 'Você não tem permissão para excluir este comentário.');
    //   return res.redirect('/');
    // }

    // //aluno.comments.remove(comment);

    req.flash('success', 'Aviso excluído com sucesso.');
    return res.redirect(redirecionarPara);
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao excluir o comentário.');
    return res.redirect('/auth/addAviso');
  }
});

module.exports = router;