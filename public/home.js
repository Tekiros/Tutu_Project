document.addEventListener('DOMContentLoaded', ()=>{
  const notificationsContainer = document.getElementById('notificationsContainer');
  notificationsContainer.innerHTML = '';

  async function atualizarNotificacoes(){
    try{
      const response = await fetch('/auth/notifications');
  
      if(!response.ok){
        throw new Error('Erro ao buscar notificações');
      }
  
      const notifications = await response.json();
  
      function calculateTimeElapsed(createdAt){
        const currentTime = new Date();
        const timeDifference = Math.floor((currentTime - createdAt) / 60000);
  
        if(timeDifference < 1){
          return 'Agora mesmo';
        }else if(timeDifference === 1){
          return '1 minuto atrás';
        }else if(timeDifference < 60){
          return `${timeDifference} minutos atrás`;
        }else if(timeDifference < 1440){
          const hours = Math.floor(timeDifference / 60);
          return `${hours} horas atrás`;
        }else{
          const days = Math.floor(timeDifference / 1440);
          return `${days} dias atrás`;
        }
      }
  
      notificationsContainer.innerHTML = '';
  
      notifications.forEach((notification)=>{
        const {text, createdAt} = notification;
  
        const notificationElement = document.createElement('div');
        const notificationCircle = document.createElement('div');
        const notificationTextElement = document.createElement('p');
        const timeElapsedElement = document.createElement('p');
  
        notificationElement.className = 'atividade-registro';
        notificationCircle.className = 'circle-atividade';
  
        const timeElapsed = calculateTimeElapsed(new Date(createdAt));
        notificationTextElement.textContent = text;
        timeElapsedElement.textContent = timeElapsed;
  
        notificationElement.appendChild(notificationTextElement);
        notificationElement.appendChild(timeElapsedElement);
        notificationElement.appendChild(notificationCircle);
        notificationsContainer.appendChild(notificationElement);
      });
    }catch(error){
      console.error('Erro ao buscar notificações:', error);
    }
  }
  setInterval(atualizarNotificacoes, 60000);

/////////////////////////////////////////////////////////////////////

  const aviso = document.querySelector('.avisoVerify')
  const titleH2 = document.getElementById('h2AviSo');

  function verifyAviso() {
    if(!aviso){
      titleH2.innerHTML = 'Não temos nenhum aviso para hoje 😁';
      titleH2.style.marginBottom = '0';
    }
  }
  verifyAviso()
  atualizarNotificacoes();
});

/////////////////////////////////////////////////////////////////////

const editProfile = document.getElementById("editProfile");
const modal = document.getElementById("myModal");
const closeModal = document.querySelector(".closeModal");

editProfile.addEventListener("click", (e)=>{
  modal.style.display = "block";
  e.preventDefault();
});

closeModal.addEventListener("click", ()=>{
modal.style.display = "none";
});

window.addEventListener("click", (event)=>{
if (event.target === modal){
  modal.style.display = "none";
}
});

/////////////////////////////////////////////////////////////////////

