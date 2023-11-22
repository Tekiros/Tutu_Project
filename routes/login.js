const express = require('express');
const router = express.Router();
const Professor = require('../professorSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET;

router.get('/login', (req,res)=>{
    res.render('login');
});
  
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;

    const maxEmailLength = 200;
    const maxPasswordLength = 50;

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

    //const start = performance.now();
    const checkPassword = await bcrypt.compare(password, user.password);
    //const end = performance.now();
    //const verificationTime = end - start;
    //console.log(`Tempo de verificação da senha: ${verificationTime} milissegundos`);

    if(!checkPassword){
        res.cookie('email', email, {httpOnly:true, maxAge:600000});
        req.flash('error', 'Credenciais inválidas');
        return res.redirect('/auth/login');
    }

    try{
        const token = jwt.sign(
        {
            id:user._id,
        },
        secret,
        {
            expiresIn: '600s',
        }
        );

        res.cookie('token', token, {httpOnly:true, maxAge:600000});
        //secure:true, sameSite:'Strict'
        res.redirect('/');
    }catch(err){
        req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde');
        return res.redirect('/auth/login');
    }
}); 

module.exports = router;