const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const HistoricoChat = require('../historicoChat.js');


router.get('/mensagens', verifyToken, async (req,res)=>{
  const historicomensagens = await HistoricoChat.find();

  try{
    Professor.findById(req.user.id, '-password').then((user)=>{
      const dadosMensagem = historicomensagens.map(historicoMensagem =>({
        _id: historicoMensagem._id,
        professor: historicoMensagem.professor,
        apelido: historicoMensagem.apelido,
        mensagem: historicoMensagem.mensagem,
        usuarioAtual: historicoMensagem.professor == user.apelido,
    }));

    res.json(dadosMensagem);
    });
  }catch(error){
    req.flash('error', 'Erro ao buscar mensagens');
  }
});

module.exports = router;