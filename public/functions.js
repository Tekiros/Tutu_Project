function removeFlashMessages(){
  const flashMessages = document.querySelectorAll('.flash-message');

  flashMessages.forEach((message)=>{
    setTimeout(() => {
      message.style.display = 'none';
    }, 5000);
  });
}
window.onload = removeFlashMessages;

function closeFlash(button) {
  const flashMessage = button.closest('.flash-message');
  flashMessage.remove();
}

//////////////////////////////////////////////////////

function menu(){
  const sidebar = document.querySelector(".sidebar");
  const sidebar2 = document.querySelector(".sidebar2")
  const titleH3 = document.getElementById('titleH3');

  if(sidebar.style.display == "none"){
    sidebar.style.display = "block"
    titleH3.style.display = 'none'
  }else{
    sidebar.style.display = 'none'
    titleH3.style.display = 'block'
  }

  if(sidebar2.style.display == "none"){
    sidebar2.style.display = "block"
    titleH3.style.display = 'none'
  }else{
    sidebar2.style.display = 'none'
    titleH3.style.display = 'block'
  }
}

function menu2(){
  const sidebar2 = document.querySelector(".sidebar2")
  const titleH3 = document.getElementById('titleH3');
  const menuIcon = document.querySelector('.menu-icon');

  if(sidebar2.style.display == "none"){
    sidebar2.style.display = "block"
    titleH3.style.display = 'none'
    menuIcon.style.flexDirection = 'column'
    menuIcon.style.marginLeft = '10%'
  }else{
    sidebar2.style.display = 'none'
    titleH3.style.display = 'block'
    menuIcon.style.flexDirection = 'row'
    menuIcon.style.marginLeft = '0'
  }
}
//////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', ()=>{
  const ordenacaoSelect = document.getElementById('ordenacaoSelect');
  
  ordenacaoSelect.addEventListener('change', ()=>{
    const opcaoSelecionada = ordenacaoSelect.value;
    const buscaQuery = new URLSearchParams(window.location.search);
    
    buscaQuery.set('ordenacao', opcaoSelecionada);
    
    window.location.search = buscaQuery.toString();
  });

  const buscaQuery = new URLSearchParams(window.location.search);
  const opcaoSelecionada = buscaQuery.get('ordenacao') || 'maisComentarios';
  ordenacaoSelect.value = opcaoSelecionada;
});
