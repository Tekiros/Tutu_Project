const jwt = require('jsonwebtoken');
const BlacklistToken = require('../../blacklistTokenSchema.js');
const secret = process.env.SECRET;
// const refreshSecret = process.env.REFRESH_SECRET; // Chave secreta para o refresh token

// async function generateTokens(user) {
//   // Token de acesso
//   const accessToken = jwt.sign({ id: user.id }, secret, { expiresIn: '600s' });

//   // Refresh token
//   const refreshToken = jwt.sign({ id: user.id }, refreshSecret, { expiresIn: '7d' });

//   return { accessToken, refreshToken };
// }

async function verifyToken(req, res, next) {
  token = req.cookies.cSIDCC;
  const existingToken = await BlacklistToken.findOne({ cSIDCC: token });

  if (existingToken) {
    res.clearCookie('cSIDCC');
    return res.redirect('/auth/login');
  }

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    decodedToken = jwt.verify(token, secret);

    req.user = decodedToken;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const tokenExpiration = decodedToken.exp;

    if (tokenExpiration - nowInSeconds < 300) {
      const { accessToken, refreshToken } = await generateTokens(req.user);


      res.clearCookie('cSIDCC');

      res.cookie('cSIDCC', accessToken, { httpOnly: true, maxAge: 600000 });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 600000 });

       next();
    }

    next();
  } catch (err) {
    return res.redirect('/auth/login');
  }
}

module.exports = verifyToken;
