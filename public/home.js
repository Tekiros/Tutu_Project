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

    atualizarNotificacoes();
});



