const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const verifyPerfilSecretaria = require('./JS/verifyProfileSecretaria.js');
const Mensagem = require('../historicoChat.js');


router.get('/mensagem/:mensagemId/delete', verifyToken, verifyPerfilSecretaria, async (req,res)=>{
  const{mensagemId} = req.params;
  //const urlAnterior = req.get('referer');
  //const redirecionarPara = urlAnterior && urlAnterior.indexOf('/mensagem/') === -1 ? urlAnterior : '/';

  try{
    // const mensagem = await Mensagem.findById(mensagemId);
    
    // if(!mensagem){
    //   req.flash('error', 'Aviso não encontrado');
    //   return res.redirect('/auth/addAviso');
    // }

    await Mensagem.findByIdAndDelete(mensagemId)

    req.flash('success', 'Mensagem excluída com sucesso.');
    return res.redirect('/auth/chat');
  }catch(error){
    console.log(error);
    req.flash('error', 'Ocorreu um erro ao excluir a mensagem.');
    return res.redirect('/auth/chat');
  }
});

module.exports = router;