const express = require('express');
const router = express.Router();
const Professor = require('../professorSchema.js');
const verifyToken = require('./JS/verifyToken.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = process.env.SECRET;


router.get('/verifyLoginEditProfile', verifyToken, (req,res)=>{
    res.render('verifyLogin');
});
  
router.post('/verifyLoginEditProfile', verifyToken, async (req,res)=>{
    const {email, password} = req.body;
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const id = fullUrl.split('/')[3];


    const maxEmailLength = 200;
    const maxPasswordLength = 50;

    if(!email){
        req.flash('error', 'Você precisa digitar seu e-mail!');
        return res.redirect('/auth/verifyLoginEditProfile');
    }

    if(email.length > maxEmailLength){
        return res.redirect('/auth/verifyLoginEditProfile');
    }

    if(!password){
        req.flash('error', 'Você precisa digitar sua senha!');
        return res.redirect('/auth/verifyLoginEditProfile');
    }

    if(password.length > maxPasswordLength){
        return res.redirect('/auth/verifyLoginEditProfile');
    }

    let user = await Professor.findOne({email:email});

    if(!user){
        req.flash('error', 'Credenciais inválidas!');
        return res.redirect('/auth/verifyLoginEditProfile');
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
        req.flash('error', 'Credenciais inválidas');
        return res.redirect('/auth/verifyLoginEditProfile');
    }
    try{
        const tokenCreateProfessor = jwt.sign(
        {
            id:user._id,
        },
        secret,
        {
            expiresIn: '300s',
        }
        );
        
        res.cookie('_mmsa_prod_intercome', tokenCreateProfessor, {httpOnly:true, maxAge:300000});
        //secure:true, sameSite:'Strict'
        return res.redirect(`/${id}/editAluno`);

    }catch(err){
        req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde');
        return res.redirect('/');
    }
}); 

module.exports = router;