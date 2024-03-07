const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken = require('./JS/verifyToken.js');
const verifyTokenProfile = require('./JS/verifyTokenProfile.js');
const Professor = require('../professorSchema.js');

router.get('/editProfile/:idProfessor', verifyToken, verifyTokenProfile, async (req,res)=>{
  const {idProfessor} = req.params;
  const professorEdit = await Professor.findById(idProfessor);

  Professor.findById(req.user.id, '-password').then((user)=>{
    if(!user){
      res.clearCookie('cSIDCC');
      res.clearCookie('_mmsa_prod_intercome');
      res.redirect('/auth/login');
    }else{
      res.render('gerenciardorEditProfile', {user:user, professorEdit:professorEdit});
    }
  }).catch(()=>{
    req.flash('error', 'Erro ao buscar dados');
    return res.redirect('/auth/gerenciadorUsuarios');
  });
});

router.post('/editProfile/:idProfessor', verifyToken, verifyTokenProfile, async (req,res)=>{
  const {idProfessor} = req.params;

  try{
    const {name, apelido, materia, email, password, confirmpassword} = req.body;
    const professor = await Professor.findById(idProfessor);
    const USER = await Professor.findById(req.user.id, '-password');
  
    const calcEmail = {
      maxEmailLength(){
        if(email.length > 200){
          req.flash('error', 'Seu e-mail possui mais de 200 caracteres. Por segurança não podemos cadastrar esse e-mail, por favor escolha outro.')
          return true;
        }
        return false;
      },
  
      verifyEmail(e){
        if(email !== professor.email){
          if(userExist){
            e.preventDefault();
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
  
    if(USER.perfilSecretaria == true){
      if(name == ''){
        req.flash('error', 'Você precisa preencher o campo "Nome Completo".');
        return res.redirect(`/auth/editProfile/${idProfessor}`);
      }
      professor.name = name
    }
  
    if(apelido == ''){
      req.flash('error', 'Você precisa preencher o campo "Apelido ou primeiro nome".');
      return res.redirect(`/auth/editProfile/${idProfessor}`);
    }
    professor.apelido = apelido;
    
    if(USER.perfilSecretaria == true){
      if(materia == ''){
        req.flash('error', 'Você precisa preencher o campo "Matéria Lecionada".');
        return res.redirect(`/auth/editProfile/${idProfessor}`);
      }
      professor.materia = materia;
    }
    
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
    professor.email = email;
    
    await professor.save();
  
    req.flash('success', 'Dados atualizados com sucesso.');
    return res.redirect(`/auth/editProfile/${idProfessor}`);

  }catch(error){
    if(error instanceof ReferenceError && error.message.includes('userExist is not defined')){
      req.flash('error', 'Este e-mail já está em uso por outro usuário.');
    }else{
      req.flash('error', 'Erro ao processar solicitação.', error);
    }
    return res.redirect(`/auth/editProfile/${idProfessor}`);
  }
});

module.exports = router;