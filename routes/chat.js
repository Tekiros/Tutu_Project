const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const HistoricoChat = require('../historicoChat.js');


router.get('/chat', verifyToken, async (req,res)=>{
    try{
      const messageLimit = req.session.messageLimit || 8;

      const historicomensagens = (await HistoricoChat.find().sort({createdAt: -1}).limit(messageLimit)).reverse();
      const dadosMensagem = historicomensagens.map((historicoMensagem)=>({
        professor: historicoMensagem.professor,
        mensagem: historicoMensagem.mensagem,
      }));

      const professor = await Professor.findById(req.user.id, '-password');
      res.render('chat', {user:professor, mensagem:dadosMensagem});
      
    }catch (err){
      console.log(err);
    }
});

module.exports = router;