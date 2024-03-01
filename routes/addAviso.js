const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const verifyPerfilSecretaria = require('./JS/verifyProfileSecretaria.js');
const Professor = require('../professorSchema.js');
const Avisos = require('../avisosSchema.js');


router.get('/addAviso', verifyToken, verifyPerfilSecretaria, async (req,res)=>{
  const avisos = (await Avisos.find()).reverse();
  const aviso = avisos.map(dadosAvisos =>{
    const avisoInstance = new Avisos({
      _id: dadosAvisos._id,
      text: dadosAvisos.text,
      author: dadosAvisos.author,
      createdAt: dadosAvisos.createdAt,
    });
    return avisoInstance
  });
  
  res.render('addAviso', {aviso:aviso})
});


router.post('/addAviso', verifyToken, verifyPerfilSecretaria, async (req,res)=>{
  const {textAviso} = req.body;
  const professor = await Professor.findById(req.user.id, '-password');

  try{
    if(!textAviso){
      req.flash('erro', 'Você precisa adicionar um aviso.')
      return res.redirect('/auth/addAviso');
    }

    if(!professor){
      req.flash('error', 'Professor não encontrado');
      return res.redirect('/auth/addAviso');
    }

    const aviso = new Avisos({
      text: `- `+textAviso,
      author: professor.name,
    });

    await aviso.save();

    req.flash('success', 'Aviso criado com sucesso.');
    return res.redirect('/auth/addAviso');

  }catch(err){
    req.flash('error', 'Erro ao adicionar aviso '+ err);
    console.log(err);
    return res.redirect('/auth/addAviso');
  }
});

module.exports = router;