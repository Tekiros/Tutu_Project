const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken = require('./JS/verifyToken.js');
const verifyTokenProfile = require('./JS/verifyTokenProfile.js');
const Professor = require('../professorSchema.js');

router.get('/editProfile', verifyToken, verifyTokenProfile, async (req,res)=>{
  const professor = await Professor.findById(req.user.id, '-password');
  res.render('editProfile', {user:professor});
});

router.post('/editProfile', verifyToken, verifyTokenProfile, async (req,res)=>{
  try{
    const {name, apelido, email, password, confirmpassword} = req.body;
    const professor = await Professor.findById(req.user.id, '-password');

    const calcEmail = {
      maxEmailLength(){
        if(email.length > 200){
          req.flash('error', 'Seu e-mail possui mais de 200 caracteres. Por segurança não podemos cadastrar esse e-mail, por favor escolha outro.')
          return true;
        }
        return false;
      },
  
      async verifyEmail() {
        try {
          if (email !== professor.email) {
            const userExist = await Professor.findOne({ email: email });
            if (userExist) {
              e.preventDefault();
              req.flash('error', 'Esse e-mail já está em uso.');
            }
          }
        } catch (error) {
          console.error('Erro ao verificar Email, tente novamente.');
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
  
    if(professor.perfilSecretaria == true){
      if(name == ''){
        req.flash('error', 'Você precisa preencher o campo "Nome Completo".');
        return res.redirect('/auth/editProfile/');
      }
      professor.name = name
    }
  
    if(apelido == ''){
      req.flash('error', 'Você precisa preencher o campo "Apelido ou primeiro nome".');
      return res.redirect('/auth/editProfile/');
    }
    professor.apelido = apelido;
    
    
    if(calcPassword.maxPasswordLength() || calcPassword.minPasswordLength() || calcPassword.checkPassword()){
      return res.redirect('/auth/editProfile');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    professor.password = passwordHash;
  
    calcEmail.maxEmailLength();
    calcEmail.verifyEmail();
    professor.email = email;
    
    await professor.save();
  
    req.flash('success', 'Dados atualizados com sucesso.');
    return res.redirect('/auth/editProfile/');

  }catch(error){
    if(error instanceof ReferenceError && error.message.includes('userExist is not defined')){
      req.flash('error', 'Este e-mail já está em uso por outro usuário.', error);
    }else{
      req.flash('error', 'Erro ao processar solicitação.', error);
    }
    return res.redirect('/auth/editProfile/');
  }
});

module.exports = router;