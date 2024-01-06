const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;

async function verifyTokenProfile (req,res,next){
    tokenCreateProfessor = req.cookies.tokenCreateProfessor;
    const existingToken = await BlacklistToken.findOne({tokenCreateProfessor:tokenCreateProfessor});
  
    if(existingToken){
      res.clearCookie('tokenCreateProfessor');
      return res.redirect('/auth/verifyLoginProfile');
    }
    if(!tokenCreateProfessor){
      return res.redirect('/auth/verifyLoginProfile');
    }
    try{
      decodedToken = jwt.verify(tokenCreateProfessor, secret);
      req.user = decodedToken
      
      next();
      }catch(err){
        return res.redirect('/');
    }
}

module.exports = verifyTokenProfile;