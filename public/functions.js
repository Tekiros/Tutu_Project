function removeFlashMessages() {
  const flashMessages = document.querySelectorAll('.flash-message');

  flashMessages.forEach((message) => {
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
  const sidebar = document.querySelector(".sidebar")
  const titleH3 = document.getElementById('titleH3')

  if(sidebar.style.display == "none"){
    sidebar.style.display = "block"
    titleH3.style.display = 'none'
  }else{
    sidebar.style.display = 'none'
    titleH3.style.display = 'block'
  }
}

//////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  const ordenacaoSelect = document.getElementById('ordenacaoSelect');
  
  ordenacaoSelect.addEventListener('change', () => {
    const opcaoSelecionada = ordenacaoSelect.value;
    const buscaQuery = new URLSearchParams(window.location.search);
    
    buscaQuery.set('ordenacao', opcaoSelecionada);
    
    window.location.search = buscaQuery.toString();
  });

  const buscaQuery = new URLSearchParams(window.location.search);
  const opcaoSelecionada = buscaQuery.get('ordenacao') || 'maisComentarios';
  ordenacaoSelect.value = opcaoSelecionada;
});
