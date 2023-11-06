const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;

async function verifyToken (req,res,next){
    token = req.cookies.token;
    const existingToken = await BlacklistToken.findOne({token:token});
  
    if(existingToken){
      res.clearCookie('token');
      return res.redirect('/auth/login');
    }
    if(!token){
      return res.redirect('/auth/login');
    }
    try{
      decodedToken = jwt.verify(token, secret);
      req.user = decodedToken
  
      const newToken = jwt.sign(
        {
          id:req.user.id,
        },
        secret,
        {
          expiresIn:'600s'
        }
        );
        res.cookie('token', newToken, {httpOnly:true, maxAge:600000, secure:true, sameSite: 'Strict'});
        
      next();
      }catch(err){
        return res.redirect('/auth/login');
    }
}

module.exports = verifyToken;