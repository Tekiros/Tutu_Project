const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken2 = require('./JS/verifyToken2.js');
const verifyToken = require('./JS/verifyToken.js');
const Professor = require('../professorSchema.js');
const e = require('connect-flash');

router.get('/editProfile', verifyToken, async (req,res)=>{
  token = req.cookies.token;

  if(token){
    Professor.findById(req.user.id, '-password').then((user)=>{
      if(!user){
        res.clearCookie('token');
        res.clearCookie('tokenCreateProfessor');
        res.redirect('/auth/login');
      }else{
        res.render('editProfile', {user:user})
      }
    }).catch(()=>{
      req.flash('error', 'Erro ao buscar dados');
      return res.redirect('/')
    })
  }
});

router.post('/editProfile', verifyToken, async (req,res)=>{
  try{
    const {name, apelido, materia, email, password, confirmpassword} = req.body;
    const professor = await Professor.findById(req.user.id, '-password');
    const userExist = await Professor.findOne({email:email});
  
    const calcEmail = {
      maxEmailLength(){
        if(email.length > 200){
          req.flash('error', 'Seu e-mail possui mais de 200 caracteres. Por segurança não podemos cadastrar esse e-mail, por favor escolha outro.')
          return true;
        }
        return false;
      },
  
      verifyEmail(){
        if(email !== professor.email){
          if(userExist){
            req.flash('error', 'Esse e-mail já está em uso. ')
          }
        }
      }
    };
  
    const calcPassword = {
      maxPasswordLength(){
        if(password.length > 50){
          req.flash('error', 'Sua senha possui mais de 50 caracteres. Por segurança não podemos cadastrar essa senha, por favor escolha outra.')
          return true;
        }
        return false;
      },
  
      minPasswordLength(){
        if(password.length < 6){
          req.flash('error', 'Sua senha está muito curta. E necessário ter no mínimo 6 caracteres.')
          return true;
        }
        return false;
      },

      checkPassword(){
        if(password !== confirmpassword){
          req.flash('error', 'As senhas não conferem!');
          return true;
        }
        return false;
      },
    };
  
    if(name == ''){
      req.flash('error', 'Você precisa preencher o campo "Nome Completo".');
      return res.redirect('/auth/editProfile');
    }
    professor.name = name
  
    if(apelido == ''){
      req.flash('error', 'Você precisa preencher o campo "Apelido ou primeiro nome".');
      return res.redirect('/auth/editProfile');
    }
    professor.apelido = apelido;
    
    if(materia == ''){
      req.flash('error', 'Você precisa preencher o campo "Matéria Lecionada".');
      return res.redirect('/auth/editProfile');
    }
    professor.materia = materia;
    
    if(password){
      calcPassword.maxPasswordLength();
      calcPassword.minPasswordLength();
      calcPassword.checkPassword();
  
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      professor.password = passwordHash
    }
  
    calcEmail.maxEmailLength();
    calcEmail.verifyEmail();
    professor.email = email
    
    await professor.save();
  
    req.flash('success', 'Dados atualizados com sucesso.');
    return res.redirect('/auth/editProfile');

  }catch(error){
    req.flash('error', 'Esse e-mail já esta cadastrado.');
    return res.redirect('/auth/editProfile');
  }

});

module.exports = router;