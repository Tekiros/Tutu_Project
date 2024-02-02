const Professor = require('../../professorSchema.js');

async function verifyPerfilSecretaria (req,res,next){
  Professor.findById(req.user.id, '-password').then((user)=>{
    if(user.perfilSecretaria == true){
      next();
    }else{
      return res.redirect('/');
    }
  }).catch(()=>{
    req.flash('error', 'Erro ao buscar dados ADDAVISO');
    return res.redirect('/');
  });
}

module.exports = verifyPerfilSecretaria;