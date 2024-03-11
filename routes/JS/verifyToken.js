const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const Professor = require('../../professorSchema.js');
const secret = process.env.SECRET;

async function verifyToken(req, res, next){
  try{
    const token = req.cookies.cSIDCC;
    const existingToken = await BlacklistToken.findOne({ cSIDCC: token });

    if(existingToken){
      res.clearCookie('cSIDCC');
      res.clearCookie('_mmsa_prod_intercome');
      return res.redirect('/auth/login');
    }

    if(!token){
      (req,res,next).preventDefault();
      return res.redirect('/auth/login');
    }

    const decodedToken = jwt.verify(token, secret);
    req.user = decodedToken;

    const user = await Professor.findById(req.user.id, '-password');

    if(!user.status){
      req.flash('error', 'Esse perfil esta temporariamente suspenso, entre em contato com secretaria para mais informações.');
      return res.redirect('/auth/login');
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const tokenExpiration = decodedToken.exp;

    if(tokenExpiration - nowInSeconds < 30000){
      const {accessToken, refreshToken} = await generateTokens(req.user);

      res.clearCookie('cSIDCC');

      res.cookie('cSIDCC', accessToken, {httpOnly: true, maxAge: 600000});
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 600000});
    }

    next();
  }catch (err){
    return res.redirect('/auth/login');
  }
}


module.exports = verifyToken;
