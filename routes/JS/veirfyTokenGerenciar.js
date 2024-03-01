const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;

async function veirfyTokenGerenciar (req,res,next){
  tokenCreateProfessor = req.cookies._mmsa_prod_intercome;
  const existingToken = await BlacklistToken.findOne({_mmsa_prod_intercome:tokenCreateProfessor});

  if(existingToken){
    res.clearCookie('_mmsa_prod_intercome');
    return res.redirect('/auth/verifyLoginGerenciar');
  }
  if(!tokenCreateProfessor){
    return res.redirect('/auth/verifyLoginGerenciar');
  }
  try{
    decodedToken = jwt.verify(tokenCreateProfessor, secret);
    req.user = decodedToken
    
    next();
    }catch(err){
      return res.redirect('/');
  }
}

module.exports = veirfyTokenGerenciar;