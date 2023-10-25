<script src="/socket.io/socket.io.js"></script>
socket.emit('new user',nome);

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(input.value){
        socket.emit('chat message',{msg:input.value,nome:nome});
        input.value = '';
    }
})
socket.on('chat message',(obj)=>{
    console.log('msg recebida' +obj)
    if(obj.nome == nome){
        var item = document.createElement('li');
        item.style.backgroundColor = '#80808014';
        item.textContent = obj.nome+': '+obj.msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }else{
        var item = document.createElement('li');
        item.textContent =obj.nome+': '+obj.msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
})