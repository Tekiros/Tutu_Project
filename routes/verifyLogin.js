const express = require('express');
const router = express.Router();
const Professor = require('../professorSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET;

router.get('/verifyLogin', (req,res)=>{
    res.render('verifyLogin');
});
  
router.post('/verifyLogin', async (req,res)=>{
    const {email, password} = req.body;

    const maxEmailLength = 200;
    const maxPasswordLength = 50;

    if(!email){
        req.flash('error', 'Você precisa digitar seu e-mail!');
        return res.redirect('/auth/verifyLogin');
    }

    if(email.length > maxEmailLength){
        return res.redirect('/auth/verifyLogin');
    }

    if(!password){
        req.flash('error', 'Você precisa digitar sua senha!');
        return res.redirect('/auth/verifyLogin');
    }

    if(password.length > maxPasswordLength){
        return res.redirect('/auth/verifyLogin');
    }

    let user = await Professor.findOne({email:email});

    if(!user){
        req.flash('error', 'Credenciais inválidas!');
        return res.redirect('/auth/verifyLogin');
    }

    //const start = performance.now();
    const checkPassword = await bcrypt.compare(password, user.password);
    //const end = performance.now();
    //const verificationTime = end - start;
    //console.log(`Tempo de verificação da senha: ${verificationTime} milissegundos`);
    

    if(!checkPassword){
        req.flash('error', 'Credenciais inválidas');
        return res.redirect('/auth/verifyLogin');
    }
    try{
        const tokenCreateProfessor = jwt.sign(
        {
            id:user._id,
        },
        secret,
        {
            expiresIn: '120s',
        }
        );
        
        res.cookie('tokenCreateProfessor', tokenCreateProfessor, {httpOnly:true, maxAge:120000, secure:true, sameSite:'Strict'});
        res.redirect('/auth/registerProfessor');
    }catch(err){
        req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde');
        return res.redirect('/');
    }
}); 

module.exports = router;