const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;

async function verifyTokenProfessor (req,res,next){
  tokenCreateProfessor = req.cookies._mmsa_prod_intercome;
  const existingToken = await BlacklistToken.findOne({_mmsa_prod_intercome:tokenCreateProfessor});

  if(existingToken){
    res.clearCookie('_mmsa_prod_intercome');
    return res.redirect('/auth/verifyLoginProfessor');
  }
  if(!tokenCreateProfessor){
    return res.redirect('/auth/verifyLoginProfessor');
  }
  try{
    decodedToken = jwt.verify(tokenCreateProfessor, secret);
    req.user = decodedToken
    
    next();
    }catch(err){
      return res.redirect('/');
  }
}

module.exports = verifyTokenProfessor;