const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');
require('dotenv').config();

const secret = process.env.SECRET;


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname,'/pages'));
app.use(express.static('public', {'Content-Type':'application/javascript'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next)=>{
  if(req.originalUrl === '/favicon.ico'){
    res.status(204).json({nope: true});
  }else{
    next();
  }
});
app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next)=>{
  res.locals.flashMessages = req.flash();
  next();
});


const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@projecttutu.yvxoqct.mongodb.net/DataBase_1?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log('Conectado com sucesso');
}).catch((err)=>{
  console.log(err.message);
});


const onlineUsers = {};
const HistoricoChat = require('./historicoChat.js');

io.on('connection', (socket)=>{
  socket.on('new user', (professor)=>{
    if(onlineUsers[professor]){
      socket.emit('new user', {success:false});
    }else{
      onlineUsers[professor] = socket.id;
      socket.emit('new user', {success:true});
      io.emit('online users', Object.keys(onlineUsers));
    }
  });

  socket.on('chat message', async (obj)=>{
    const professor = obj.nome;
    const mensagem = obj.msg;

    if (onlineUsers[professor] === socket.id){
      io.emit('chat message', obj);

      try{
        const historicoChat = new HistoricoChat({
          professor: professor,
          mensagem: mensagem,
        });

        await historicoChat.save();

      }catch(error){
        console.log(error);
      }
    }else{
      req.flash('error', 'Aconteceu um erro no servidor, tente fazer o login novamente!');
    }
  });

  socket.on('disconnect', ()=>{
    const professor = Object.keys(onlineUsers).find((key) => onlineUsers[key] === socket.id);
    if(professor){
      delete onlineUsers[professor];
      io.emit('online users', Object.keys(onlineUsers));
    }
  });
});


const login = require('./routes/login.js');
const auth = require('./routes/auth.js');
const chat = require('./routes/chat.js');
const chatIncreaseLimit = require('./routes/chatIncreaseLimit.js');
const mensagens = require('./routes/mensagens.js');
const registerAluno = require('./routes/registerAluno.js');
const registerProfessor = require('./routes/registerProfessor.js');
const id = require('./routes/id.js');
const idRegisterComment = require('./routes/idRegisterComment.js');
const notifications = require('./routes/notifications.js');
const idEditCommentId = require('./routes/idEditCommentId.js');
const idDeleteCommentId = require('./routes/idDeleteCommentId.js');
const slug = require('./routes/slug.js');
const logout = require('./routes/logout.js');
const verifyLogin = require('./routes/verifyLogin.js');


app.use('/auth', login);
app.use('/', auth);
app.use('/auth', chat);
app.use('/auth', chatIncreaseLimit);
app.use('/auth', mensagens);
app.use('/auth', registerAluno);
app.use('/auth', verifyLogin);
app.use('/auth', registerProfessor);
app.use('/', id);
app.use('/', idRegisterComment);
app.use('/auth', notifications);
app.use('/', idEditCommentId);
app.use('/', idDeleteCommentId);
app.use('/auth', logout);
app.use('/auth', slug);



http.listen(3000, ()=>{
  console.log('Servidor funcionando');
}); 