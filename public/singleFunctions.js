const addComent = document.getElementById("addComent");
const modal = document.getElementById("myModal");
const confirmBtn = document.getElementById("confirmBtn");
const closeModal = document.querySelector(".closeModal");
const commentText = document.getElementById('commentText');
const textModal = document.getElementById('textModal');
const btnVoltar = document.querySelector('.btnVoltar');

addComent.addEventListener("click", (e) => {
  if(commentText.value === ''){
      textModal.innerText = 'Você precisa inserir um comentário!';
    }else{
      modal.style.display = "block";
      e.preventDefault()
    }
});

btnVoltar.addEventListener("click", ()=>{
  modal.style.display = "none";
});

closeModal.addEventListener("click", ()=>{
  modal.style.display = "none";
});

window.addEventListener("click", (event)=>{
  if (event.target === modal){
    modal.style.display = "none";
  }
});

////////////////////////////////////////////////////////////////

const opcoesComentarios = document.querySelectorAll('.opcoesComentarios');

function openMenu2(event){
  opcaoComentario = event.target;
  menuComentario = opcaoComentario.parentElement.nextElementSibling;

  if(menuComentario.style.display == 'none'){
    menuComentario.style.display = 'block'
  }else{
    menuComentario.style.display = 'none'
  }
    
}

function toggleEditForm(commentId) {
  var liElement = document.getElementById(`commentDefault${commentId}`);
  var formElement = document.getElementById(`commentEdit${commentId}`);
  
  if(liElement && formElement) {
    if(liElement.style.display === "none") {
      liElement.style.display = "block";
      formElement.style.display = "none";
    } else {
      liElement.style.display = "none";
      formElement.style.display = "block";
    }
  }


}

function toggleDeleteComment(commentId){
    modal.style.display = 'block'
    textModal.innerText = '';
    textModal.innerText = 'Você tem certeza que deseja excluir esse comentário?';
    var urlId = window.location.href;
    var urlSplit = urlId.split('/');
    var id = urlSplit[urlSplit.length - 1];
    var url = `/${id}/delete/${commentId}`


    confirmBtn.addEventListener('click', (e)=>{
      if(confirmBtn){
        window.location.href = url
        e.preventDefault()
      }else{
        modal.style.display = "block";
        e.preventDefault()
      }
    });



}

opcoesComentarios.forEach((opcaoComentario)=>{opcaoComentario.addEventListener('click', openMenu2)});

////////////////////////////////////////////////////////////////

const divsComentarioUnico = Array.from(document.querySelectorAll('.comentarioUnico'));
const perPage = 10;
let currentPage = 1;
const totalPage = Math.ceil(divsComentarioUnico.length / perPage);

const html = {
  get(element) {
    return document.querySelector(element);
  }
};

function updateCommentsDisplay() {
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  divsComentarioUnico.forEach((comment, index) => {
    if (index >= startIndex && index < endIndex) {
      comment.style.display = 'block';
    } else {
      comment.style.display = 'none';
    }
  });
}

function scroll(){
  const topComentariosElement = document.getElementById('topComentarios');
  if(topComentariosElement){
    topComentariosElement.scrollIntoView({behavior: 'smooth'});
  }
}

const controls = {
  next() {
    currentPage++;
    scroll()

    if (currentPage > totalPage) {
      currentPage--;
    }
  },
  prev() {
    currentPage--;
    scroll()

    if (currentPage < 1) {
      currentPage++;
    }
  },
  goTo(page) {
    scroll()
    
    if (page < 1) {
      page = 1;
    }

    currentPage = page;

    if (page > totalPage) {
      currentPage = totalPage;
    }
  },
  createListeners() {
    html.get('.first').addEventListener('click', () => {
      controls.goTo(1);
      update();
    });
    html.get('.last').addEventListener('click', () => {
      controls.goTo(totalPage);
      update();
    });
    html.get('.next').addEventListener('click', () => {
      controls.next();
      update();
    });
    html.get('.prev').addEventListener('click', () => {
      controls.prev();
      update();
    });
  }
};

const list = {
  create(item) {
    html.get('.list').appendChild(item);
  },
  update() {
    html.get('.list').innerHTML = '';

    updateCommentsDisplay();
  }
}

const buttons = {
  element: html.get('.pagination .numbers'),
  create(number) {
    const button = document.createElement('div');

    button.innerHTML = number;

    if (currentPage == number) {
      button.classList.add('active');
    }

    button.addEventListener('click', (event) => {
      const page = parseInt(event.target.innerHTML, 10);
      controls.goTo(page);
      update();
    });

    buttons.element.appendChild(button);
  },
  update() {
    buttons.element.innerHTML = '';
    const {maxLeft, maxRight} = buttons.calculateMaxVisible();

    for(let page = maxLeft; page <= maxRight; page++) {
      buttons.create(page);
    }
  },
  calculateMaxVisible() {
    const maxVisibleButtons = 5;
    let maxLeft = currentPage - Math.floor(maxVisibleButtons / 2);
    let maxRight = currentPage + Math.floor(maxVisibleButtons / 2);

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = maxLeft + maxVisibleButtons - 1;
    }
    if (maxRight > totalPage) {
      maxRight = totalPage;
      maxLeft = maxRight - maxVisibleButtons + 1;

      if (maxLeft < 1) maxLeft = 1;
    }

    return { maxLeft, maxRight };
  }
};

function update() {
  list.update();
  buttons.update();
}

function init() {
  update();
  controls.createListeners();
  updateCommentsDisplay();
}

init();

////////////////////////////////////////////////////////////////////

