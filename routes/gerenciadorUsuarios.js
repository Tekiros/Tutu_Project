const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const veirfyTokenGerenciar = require('./JS/veirfyTokenGerenciar.js');
const verifyPerfilSecretaria = require('./JS/verifyProfileSecretaria.js');
const Aluno = require('../alunosSchema.js');
const Professor = require('../professorSchema.js');

router.get('/gerenciadorUsuarios', verifyToken, veirfyTokenGerenciar, verifyPerfilSecretaria, async (req,res)=>{
  const busca = req.query.busca2 || '';
  const palavrasChave = busca.split(' ').filter(Boolean);

  const regexArray = palavrasChave.map(keyword =>({
    $or:[
      {name: {$regex: new RegExp(keyword, 'i')}},
      {surname: {$regex: new RegExp(keyword, 'i')}}
    ]
  }));

  const resultadoAlunos = await Aluno.find({$and: regexArray.length > 0 ? regexArray : [{}]});
  const opcaoOrdenacaoAlunos = req.query.ordenacao || 'maisComentarios';

  let resultadosOrdenadosAlunos;
  if(opcaoOrdenacaoAlunos === 'maisComentarios'){
    resultadosOrdenadosAlunos = resultadoAlunos.sort((a, b) => b.comments.length - a.comments.length);
  }else if(opcaoOrdenacaoAlunos === 'ordemAlfabetica'){
    resultadosOrdenados = resultadoAlunos.sort((a, b)=>{
      const nomeCompletoA = `${a.name} ${a.surname}`;
      const nomeCompletoB = `${b.name} ${b.surname}`;
      return nomeCompletoA.localeCompare(nomeCompletoB);
    });
  }

  const resultadoProfessor = await Professor.find({$and: regexArray.length > 0 ? regexArray : [{}]});

  res.render('gerenciadorUsuarios', {professores:resultadoProfessor, aluno:resultadosOrdenadosAlunos, busca:req.query.busca || ''});
});

module.exports = router;