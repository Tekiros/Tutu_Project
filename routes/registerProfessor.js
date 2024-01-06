const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken = require('./JS/verifyToken.js');
const verifyTokenProfessor = require('./JS/verifyTokenProfessor.js');
const Professor = require('../professorSchema.js');


router.get('/registerProfessor', verifyToken, verifyTokenProfessor, async (req,res)=>{
  res.render('registerProfessor')
});
  
router.post('/registerProfessor', verifyToken, verifyTokenProfessor, async (req,res)=>{
  const {name, apelido, materia, email, password, confirmpassword} = req.body;
  const userExist = await Professor.findOne({email:email});

  const maxEmailLength = 200;
  const maxPasswordLength = 50;
  const minPasswordLength = 6;

  if(name == ''){
    req.flash('error', 'Você precisa preencher o campo "Nome Completo".');
    return res.redirect('/auth/registerProfessor');
  }

  if(apelido == ''){
    req.flash('error', 'Você precisa preencher o campo "Apelido ou primeiro nome".');
    return res.redirect('/auth/registerProfessor');
  }

  if(materia == ''){
    req.flash('error', 'Você precisa preencher o campo "Matéria Lecionada".');
    return res.redirect('/auth/registerProfessor');
  }

  if(email == ''){
    req.flash('error', 'Você precisa preencher o campo "E-mail".');
    return res.redirect('/auth/registerProfessor');
  }

  if(email.length > maxEmailLength){
    req.flash('error', 'Seu e-mail possui mais de 200 caracteres. Por segurança não podemos cadastrar esse e-mail, por favor escolha outro.')
    return res.redirect('/auth/registerProfessor');
  }

  if(!password){
    req.flash('error', 'A senha é obrigatório.');
    return res.redirect('/auth/registerProfessor');
  }

  if(password.length > maxPasswordLength){
    req.flash('error', 'Sua senha possui mais de 50 caracteres. Por segurança não podemos cadastrar essa senha, por favor escolha outra.')
    return res.redirect('/auth/registerProfessor');
  }

  if(password.length < minPasswordLength){
    req.flash('error', 'Sua senha está muito curta. E necessário ter no mínimo 6 caracteres.')
    return res.redirect('/auth/registerProfessor');
  }

  if(password !== confirmpassword){
    req.flash('error', 'As senhas não conferem!');
    return res.redirect('/auth/registerProfessor');
  }
  
  if(userExist){
    req.flash('error', 'Esse e-mail já está em uso.');
    return res.redirect('/auth/registerProfessor');
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new Professor({
    name,
    apelido,
    email,
    materia,
    password: passwordHash
  });

  try{
   if(verifyTokenProfessor){
    await user.save();

    req.flash('success', 'Professor(a) cadastrado com sucesso');
    return res.redirect('/auth/registerProfessor');
   }else(
    res.redirect ('/auth/verifyLogin')
   )
    
  }catch(err){
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde // Esse professor(a) já pode estar cadastrado');
    return res.redirect('/auth/registerProfessor');
  }
});

module.exports = router;