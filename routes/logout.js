const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');

const BlacklistToken = require('../blacklistTokenSchema.js');


router.get('/logout', verifyToken, async (req,res)=>{
  res.clearCookie('token');
  token = req.cookies.token;

  try{
    const existingToken = await BlacklistToken.findOne({token: token});
    if(existingToken){
      req.flash('error', 'Token Inválido');
    }

    const blacklistToken = new BlacklistToken({token: token});
    await blacklistToken.save();

    req.flash('success', 'Você saiu da sua conta com sucesso!');
    return res.redirect('/auth/login');
  }catch(err){
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde');
  }
});

module.exports = router;