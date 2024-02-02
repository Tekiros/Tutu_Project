const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const BlacklistToken = require('../blacklistTokenSchema.js');


router.get('/logout', verifyToken, async (req,res)=>{
  const token = req.cookies.cSIDCC;
  const tokenCreateProfessor = req.cookies._mmsa_prod_intercome;

  try{
    res.clearCookie('_mmsa_prod_intercome');
    res.clearCookie('cSIDCC');

    const blacklistToken = new BlacklistToken({token:token, tokenCreateProfessor:tokenCreateProfessor});
    await blacklistToken.save();

    req.flash('success', 'Você saiu da sua conta com sucesso!');
    return res.redirect('/auth/login');
  }catch(err){
    console.error('Erro ao salvar o token na lista negra:', err);
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde');
    return res.redirect('/');
  }
});

module.exports = router;