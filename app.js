const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const Aluno = require('./alunosSchema.js');
const Notification = require('./notificationsSchema.js');
const Professor = require('./professorSchema')
const BlacklistToken = require('./blacklistTokenSchema');
const flash = require('connect-flash');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
require('dotenv').config();


const secret = process.env.SECRET;
let decodedToken = '';
let token = '';
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname,'/pages'));
app.use(express.static('public', {'Content-Type':'application/javascript'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
});
app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@projecttutu.yvxoqct.mongodb.net/DataBase_1?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log('Conectado com sucesso');
}).catch((err)=>{
  console.log(err.message);
});

async function verifyToken (req,res,next){
  token = req.cookies.token;
  const existingToken = await BlacklistToken.findOne({token:token});

  if (existingToken){
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
      res.cookie('token', newToken, {httpOnly:true, maxAge:600000});
    next();
  }catch(err){
    return res.redirect('/auth/login');
}
}

app.get('/socket.io/socket.io.js', (req, res)=>{
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');

});
var usuarios = [];
var socketIds = [];
io.on('connection',(socket)=>{
  socket.on('new user',function(data){
      if(usuarios.indexOf(data) != -1){
          socket.emit('new user',{success: false});
      }else{
          usuarios.push(data);
          socketIds.push(socket.id);
          socket.emit('new user',{success: true});
          //Emit para os outros usuários dizendo que tem um novo usuário ativo.
          //socket.broadcast.emit("hello", "world");
      }
  })

  socket.on('chat message',(obj)=>{
    console.log(obj)
      if(usuarios.indexOf(obj.nome) != -1 && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)){
          io.emit('chat message',obj);
      }else{
          console.log('Erro: Você não tem permissão para executar a ação.');
      }
  })

  socket.on('disconnect', () => {
      let id = socketIds.indexOf(socket.id);
      socketIds.splice(id,1);
      usuarios.splice(id,1);
      console.log(socketIds);
      console.log(usuarios);
      console.log('user disconnected');
  });
})


app.get('/', verifyToken, async (req,res)=>{
  if(req.query.busca == null){
    token = req.cookies.token;

    if(token){
      try{
        decodedToken = jwt.verify(token, secret);
        
        Professor.findById(decodedToken.id, '-password').then((user)=>{
          if(!user){
            res.redirect('/auth/login');
          }else{
            res.render('home',{user:user});
          }
        }).catch(()=>{
          req.flash('error', 'Erro ao buscar dados');
          return res.redirect('/auth/login');
        });
      }catch(err){
        console.log(err);
      } 
    }
  }else{
    try {
      const regex = new RegExp(req.query.busca, 'i');
      const resultadoAlunos = await Aluno.find({
        $or: [
          {name: regex},
          {surname: regex}
        ]
      });
    
      const opcaoOrdenacao = req.query.ordenacao || 'maisComentarios';
    
      let resultadosOrdenados;
      if (opcaoOrdenacao === 'maisComentarios') {
        resultadosOrdenados = resultadoAlunos.sort((a, b) => b.comments.length - a.comments.length);
      } else if (opcaoOrdenacao === 'ordemAlfabetica') {
        resultadosOrdenados = resultadoAlunos.sort((a, b) => {
          const nomeCompletoA = `${a.name} ${a.surname}`;
          const nomeCompletoB = `${b.name} ${b.surname}`;
          return nomeCompletoA.localeCompare(nomeCompletoB);
        });
      }
    
      res.render('busca', {aluno:resultadosOrdenados, contagem:resultadosOrdenados.length, busca:req.query.busca || ''});
    } catch (err) {
      req.flash('error', 'Erro ao buscar dados');
      return res.redirect('/?busca=SemResultados');
    }
  }
});

app.get('/auth/registerProfessor', verifyToken, async (req,res)=>{
  res.render('registerProfessor')
});

app.post('/auth/registerProfessor', verifyToken, async (req,res)=>{
  const {name, apelido, materia, email, password, confirmpassword} = req.body;
  const userExist = await Professor.findOne({email:email});

  if(!name){
    req.flash('error', 'Já existe um professor registrado com esse nome.');
    return res.redirect('/auth/registerProfessor');
  }
  if(!materia){
    req.flash('error', 'A matéria lecionada é obrigatória.');
    return res.redirect('/auth/registerProfessor');
  }
  if(!email){
    req.flash('error', 'O e-mail é obrigatório.');
    return res.redirect('/auth/registerProfessor');
  }
  if(!password){
    req.flash('error', 'A senha é obrigatório.');
    return res.redirect('/auth/registerProfessor');
  }
  if(password !== confirmpassword){
    req.flash('error', 'As senha não conferem!');
    return res.redirect('/auth/registerProfessor');
  }
  
  if(userExist){
    req.flash('error', 'Esse e-mail já está em uso.');
    return res.redirect('/auth/registerProfessor');
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = new Professor({
    name,
    apelido,
    email,
    materia,
    password: passwordHash
  });

  try{
    await user.save();
    req.flash('success', 'Professor(a) cadastrado com sucesso');
    return res.redirect('/auth/registerProfessor');
  }catch(err){
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde // Esse aluno(a) já pode estar cadastrado');
    return res.redirect('/auth/registerProfessor');
  }
});

app.get('/auth/login', (req,res)=>{
  res.render('login');
});

app.post('/auth/login', async (req,res)=>{
  const {email, password} = req.body;

  if(!email){
    req.flash('error', 'O email é obrigatório');
    return res.redirect('/auth/login');
  }
  if(!password){
    req.flash('error', 'Senha incorreta');
    return res.redirect('/auth/login');
  }

  const user = await Professor.findOne({email:email});

  if(!user){
    req.flash('error', 'Esse Usuário não existe!');
    return res.redirect('/auth/login');
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if(!checkPassword){
    req.flash('error', 'Senha incorreta');
    return res.redirect('/auth/login');
  }
  try{
    const token = jwt.sign(
      {
        id:user._id,
      },
      secret,
      {
        expiresIn: '60s',
      }
    )
    res.cookie('token', token, {httpOnly: true, maxAge: 60000});
    res.redirect('/');
  }catch(err){
    console.log(err);
    res.status(500).json({msg:'Aconteceu um erro no servidor, tente novamente mais tarde'})
  }
});

app.get('/auth/registerAluno', verifyToken, async (req,res)=>{
  res.render('registerAluno');
});

app.post('/auth/registerAluno', verifyToken, async (req,res)=>{
  const {name, surname, id_aluno} = req.body;
  const alunoExist = await Aluno.findOne({id_aluno:id_aluno});

  if(!name){
    req.flash('error', 'O nome do aluno(a) e obrigatório');
    return res.redirect('/auth/registerAluno');
  }
  if(!surname){
    req.flash('error', 'O nome do aluno(a) e obrigatório');
    return res.redirect('/auth/registerAluno');
  }
  if(!id_aluno){
    req.flash('error', 'O identificado do aluno(a) e obrigatório');
    return res.redirect('/auth/registerAluno');
  }
  
  if(alunoExist){
    req.flash('error', 'Esse aluno(a) já está cadastrado');
    return res.redirect('/auth/registerAluno');
  }

  const aluno = new Aluno({
    _id: new mongoose.Types.ObjectId(),
    name,
    surname,
    id_aluno,
    comments: [],
  });

  try{
    await aluno.save();
    req.flash('success', 'Aluno(a) cadastrado com sucesso');
    return res.redirect('/auth/registerAluno');
  }catch(err){
    req.flash('error', 'Aconteceu um erro no servidor, tente novamente mais tarde // Esse aluno(a) já pode estar cadastrado');
    return res.redirect('/auth/registerAluno');
  }
});

app.get('/:id', verifyToken, async (req,res)=>{
  const {id} = req.params

  try{
    const alunoId = await Aluno.findById(id);
    const comments = alunoId.comments;
    
    if(!alunoId){
      req.flash('error', 'Aluno não encontrado');
      return res.redirect(`/${id}`);
    }
    res.render('single', {alunoId:alunoId, comments:comments});
  }catch(error){
    req.flash('error', 'Erro ao buscar aluno(a)');
    return res.redirect('/');
  }
});

app.post('/:id/registerComment', verifyToken, async (req, res) => {
  const {id} = req.params;
  const {commentText,commentTitle} = req.body;

  try{
    const aluno = await Aluno.findById(id);

    if(!aluno) {
      req.flash('error', 'Aluno não encontrado');
      return res.redirect(`/${id}`);
    }

    const professor = await Professor.findById(decodedToken.id, '-password');

    if(!professor) {
      req.flash('error', 'Professor não encontrado');
      return res.redirect(`/${id}`);
    }

    if(!commentTitle) {
      req.flash('error', 'Você precisa adicionar um título ao comentário.');
      return res.redirect(`/${id}`);
    }

    if(!commentText) {
      req.flash('error', 'Você precisa adicionar um comentário.');
      return res.redirect(`/${id}`);
    }

    aluno.comments.push({
      textTitle: commentTitle,
      text: commentText,
      author: professor.name,
    });

    await aluno.save();

    //////////////////////////////////////////////

    const notification = new Notification({
      text: `${professor.apelido} fez um comentário em ${aluno.name}.`,
      aluno: aluno._id,
    });

    await notification.save();

    req.flash('success', 'Comentário criado com sucesso.');
    res.redirect(`/${id}`);
  } catch(error){
    req.flash('error', 'Erro ao adicionar comentário');
    console.log(error);
    return res.redirect(`/${id}`);
  }
});

app.get('/auth/notifications', verifyToken, async (req, res) => {
  try{
    const notifications = await Notification.find()
      .sort({createdAt: -1})
      .limit(10);

      res.json(notifications);
  }catch (error){
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

app.get('/:id/delete/:commentId', verifyToken, async (req, res) => {
  const{id, commentId} = req.params;
  const professor = await Professor.findById(decodedToken.id, '-password');

  try{
    const aluno = await Aluno.findById(id);

    if (!aluno){
      req.flash('error', 'Aluno não encontrado');
      return res.redirect('/');
    }

    const comment = aluno.comments.find(comment => comment._id.toString() === commentId);

    if (!comment){
      req.flash('error', 'Comentário não encontrado');
      return res.redirect(`/${id}`);
    }

    if(comment.author !== professor.name){
      req.flash('error', 'Você não tem permissão para excluir este comentário.');
      return res.redirect(`/${id}`);
    }

    aluno.comments.remove(comment);

    await aluno.save();

    req.flash('success', 'Comentário excluído com sucesso.');
    return res.redirect(`/${id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao excluir o comentário.');
    return res.redirect(`/${id}`);
  }
});

app.post('/:id/edit/:commentId', verifyToken, async (req, res) => {
  const{id, commentId} = req.params;
  const professor = await Professor.findById(decodedToken.id, '-password');
  const {commentTitle, commentText} = req.body;

  try{
    const aluno = await Aluno.findById(id);

    if (!aluno){
      req.flash('error', 'Aluno não encontrado');
      return res.redirect('/');
    }

    var comment = aluno.comments.find(comment => comment._id.toString() === commentId);

    if (!comment){
      req.flash('error', 'Comentário não encontrado');
      return res.redirect(`/${id}`);
    }

    if(comment.author !== professor.name){
      req.flash('error', 'Você não tem permissão para excluir este comentário.');
      return res.redirect(`/${id}`);
    }

    comment.textTitle = commentTitle;
    comment.text = commentText +`
    (Comentário editado)
    `;
    comment.createdAt = new Date();

    await aluno.save();

    req.flash('success', 'Comentário editado com sucesso.');
    return res.redirect(`/${id}`);
  }catch(error){
    console.error(error);
    req.flash('error', 'Ocorreu um erro ao editar o comentário.');
    return res.redirect(`/${id}`);
  }
});

app.get('/auth/chat', verifyToken, async (req,res)=>{
  res.render('chat');
});

app.get('/auth/logout', verifyToken, async (req, res) => {
  res.clearCookie('token');
  token = req.cookies.token;

  try {
    const existingToken = await BlacklistToken.findOne({ token: token });
    if (existingToken) {
      return res.status(401).json({ msg: 'Token Inválido' });
    }

    const blacklistToken = new BlacklistToken({ token: token });
    await blacklistToken.save();

    req.flash('success', 'Você saiu da sua conta com sucesso!');
    return res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde' });
  }
});

app.get('/:slug', verifyToken, async (req,res)=>{
  res.send(req.params.slug)
});

app.listen(3000,()=>{
  console.log('Servidor funcionando');
});