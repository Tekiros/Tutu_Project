const inputEmail = document.getElementById('passwordRegiter');
const divNotification = document.querySelector('.passwordRegiter');

inputEmail.addEventListener('click', ()=>{
    divNotification.style.display = 'block';
});

document.addEventListener('click', (event)=>{
    if(!inputEmail.contains(event.target)){
        divNotification.style.display = 'none';
    }
});

///////////////////////////////////////////////