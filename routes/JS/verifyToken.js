const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;

async function verifyToken(req, res, next){
  try{
    const token = req.cookies.cSIDCC;
    const existingToken = await BlacklistToken.findOne({ cSIDCC: token });

    if(existingToken){
      res.clearCookie('cSIDCC');
      return res.redirect('/auth/login');
    }

    if(!token){
      return res.redirect('/auth/login');
    }

    const decodedToken = jwt.verify(token, secret);
    req.user = decodedToken;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const tokenExpiration = decodedToken.exp;

    if(tokenExpiration - nowInSeconds < 30000){
      const {accessToken, refreshToken} = await generateTokens(req.user);

      res.clearCookie('cSIDCC');

      res.cookie('cSIDCC', accessToken, {httpOnly: true, maxAge: 600000}); // 10 minutos
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 600000}); // 10 minutos
    }

    next();
  }catch (err){
    return res.redirect('/auth/login');
  }
}


module.exports = verifyToken;
