const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;

async function verifyLoginEditProfile (req,res,next){
  tokenCreateProfessor = req.cookies._mmsa_prod_intercome;
  const existingToken = await BlacklistToken.findOne({_mmsa_prod_intercome:tokenCreateProfessor});
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const id = fullUrl.split('/')[3];
  
  if(existingToken){
    res.clearCookie('_mmsa_prod_intercome');
    return res.redirect(`/${id}/editAluno/verifyLoginEditProfile`);
  }
  if(!tokenCreateProfessor){
    return res.redirect(`/${id}/editAluno/verifyLoginEditProfile`);
  }
  try{
    decodedToken = jwt.verify(tokenCreateProfessor, secret);
    req.user = decodedToken
    
    next();
    }catch(err){
      return res.redirect('/');
  }
}

module.exports = verifyLoginEditProfile;