const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const Aluno = require('../alunosSchema.js');
const HistoricoChat = require('../historicoChat.js');
const Avisos = require('../avisosSchema.js');


router.get('/', verifyToken, async (req,res)=>{
    if(req.query.busca == null){
      try{
        const historicomensagens = (await HistoricoChat.find().sort({createdAt: -1}).limit(5)).reverse();
        const dadosMensagem = historicomensagens.map(historicoMensagem =>({
            professor: historicoMensagem.professor,
            mensagem: historicoMensagem.mensagem,
        }));
        ////////////////////////////////////////////////////////
        const avisos = (await Avisos.find()).reverse();
        const aviso = avisos.map(dadosAvisos =>{
          const avisoInstance = new Avisos({
            _id: dadosAvisos._id,
            text: dadosAvisos.text,
            author: dadosAvisos.author,
            createdAt: dadosAvisos.createdAt,
          });
          return avisoInstance
        })
        ////////////////////////////////////////////////////////

        Professor.findById(req.user.id, '-password').then((user)=>{
          if(!user){
            res.clearCookie('cSIDCC');
            res.clearCookie('_mmsa_prod_intercome');
            res.redirect('/auth/login');
          }else{
            res.render('home',{user:user, mensagem:dadosMensagem, aviso:aviso});
          }
        }).catch(()=>{
          req.flash('error', 'Erro ao buscar dados');
          return res.redirect('/auth/login');
        });
      }catch(err){
        console.log(err);
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