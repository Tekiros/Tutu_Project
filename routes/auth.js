const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const Aluno = require('../alunosSchema.js');
const HistoricoChat = require('../historicoChat.js');


router.get('/', verifyToken, async (req,res)=>{
    if(req.query.busca == null){
      token = req.cookies.token;
  
      if(token){
        try{
          var historicomensagens = (await HistoricoChat.find().sort({createdAt: -1}).limit(5)).reverse();
          var dadosMensagem = historicomensagens.map(historicoMensagem =>({
              professor: historicoMensagem.professor,
              mensagem: historicoMensagem.mensagem,
          }));
  
          ////////////////////////////////////////////////////////
  
          Professor.findById(req.user.id, '-password').then((user)=>{
            if(!user){
              res.redirect('/auth/login');
            }else{
              res.render('home',{user:user, mensagem:dadosMensagem});
            }
          }).catch(()=>{
            req.flash('error', 'Erro ao buscar dados');
            return res.redirect('/auth/login');
          });
        }catch(err){
          console.log(err);
        } 
      }
    }else{
      try{
        const regex = new RegExp(req.query.busca, 'i');
        const resultadoAlunos = await Aluno.find({
          $or: [
            {name: regex},
            {surname: regex}
          ]
        });
      
        const opcaoOrdenacao = req.query.ordenacao || 'maisComentarios';
      
        let resultadosOrdenados;
        if(opcaoOrdenacao === 'maisComentarios'){
          resultadosOrdenados = resultadoAlunos.sort((a, b) => b.comments.length - a.comments.length);
        }else if(opcaoOrdenacao === 'ordemAlfabetica'){
          resultadosOrdenados = resultadoAlunos.sort((a, b)=>{
            const nomeCompletoA = `${a.name} ${a.surname}`;
            const nomeCompletoB = `${b.name} ${b.surname}`;
            return nomeCompletoA.localeCompare(nomeCompletoB);
          });
        }
      
        res.render('busca', {aluno:resultadosOrdenados, contagem:resultadosOrdenados.length, busca:req.query.busca || ''});
      }catch(err){
        req.flash('error', 'Erro ao buscar dados');
        return res.redirect('/?busca=SemResultados');
      }
    }
});

module.exports = router;