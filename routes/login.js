const express = require('express');
const router = express.Router();
const Professor = require('../professorSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET;

router.get('/login', async (req,res)=>{
    res.render('login');
});
  
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;

    const maxEmailLength = 200;
    const maxPasswordLength = 50;
    const now = new Date();
    const lockoutTime = 60 * 1000 * 10;


    if(!email){
        req.flash('error', 'Você precisa digitar seu e-mail!');
        return res.redirect('/auth/login');
    }

    if(email.length > maxEmailLength){
        return res.redirect('/auth/login');
    }

    if(!password){
        req.flash('error', 'Você precisa digitar sua senha!');
        return res.redirect('/auth/login');
    }

    if(password.length > maxPasswordLength){
        return res.redirect('/auth/login');
    }

    let user = await Professor.findOne({email:email});

    if(!user){
        req.flash('error', 'Credenciais inválidas!');
        return res.redirect('/auth/login');
    }

    if(user.lasLoginAttempt && (now - user.lasLoginAttempt) > lockoutTime){
        user.loginAttemps = 0;
    }

    if(user.loginAttemps >= 10){
        req.flash('error', 'Por favor, tente fazer o login novamente daqui a alguns minutos.');
        return res.redirect('/auth/login');
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
        user.loginAttemps += 1;
        user.lasLoginAttempt = now;
        res.cookie('email', email);
        req.flash('error', 'Credenciais inválidas');
        await user.save();
        return res.redirect('/auth/login');
    }

    if(!user.status){
        req.flash('error', 'Esse perfil esta temporariamente suspenso, entre em contato com secretaria para mais informações.');
        return res.redirect('/auth/login');
    }

    try{
        const token = jwt.sign(
        {id:user._id}, 
        secret,
        { expiresIn: '1h', algorithm: 'HS256'},
        );

        res.clearCookie('email');
        res.cookie('cSIDCC', token, {httpOnly:true, maxAge:3600000});
        await user.save();
        res.redirect('/');
    }catch(err){
        req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde' + err);
        return res.redirect('/auth/login');
    }
}); 

module.exports = router;