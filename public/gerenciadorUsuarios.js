const deleteButtons = document.querySelectorAll(".deleteProfileBtn");
const statusButtons = document.querySelectorAll('.statusBtn');
const modals = document.querySelectorAll(".myModal");
const closeModal = document.querySelectorAll(".closeModal");
const btnVoltar = document.querySelectorAll('.btnVoltar');

const mostrarModal = (indice) => {
  modals[indice].style.display = "block";
};

deleteButtons.forEach((botaoExcluir, indice) => {
  botaoExcluir.addEventListener("click", (e) => {
    e.preventDefault();
    mostrarModal(indice);
  });
});

btnVoltar.forEach((fechar) => {
  fechar.addEventListener("click", () => {
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
  });
});

closeModal.forEach((fechar) => {
  fechar.addEventListener("click", () => {
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
  });
});

window.addEventListener("click", (evento) => {
  modals.forEach((modal) => {
    if (evento.target === modal) {
      modal.style.display = "none";
    }
  });
});


////////////////////////////////////////////////////////

const h2Professores = document.getElementById('h2Professores');
const h2Alunos = document.getElementById('h2Alunos');
const tbProfessoresPC = document.getElementById('tbProfessoresPC');
const tbProfessoresPHONE = document.getElementById('tbProfessoresPHONE');
const tbAlunosPC = document.getElementById('tbAlunosPC');
const tbAlunosPHONE = document.getElementById('tbAlunosPHONE');
const width = window.innerWidth;

function tb1(){
  if(tbProfessoresPC.style.display === 'none' && width > 500){
    tbProfessoresPC.style.display = 'block';
    tbAlunosPC.style.display = 'none';
    tbAlunosPHONE.style.display = 'none';
  }
  else if(tbProfessoresPHONE.style.display === 'none' && width < 500){
    tbProfessoresPHONE.style.display = 'block';
    tbAlunosPC.style.display = 'none';
    tbAlunosPHONE.style.display = 'none';
  }
  else{
    tbProfessoresPC.style.display = 'none';
    tbProfessoresPHONE.style.display = 'none';
  }

}

function tb2(){
  if(tbAlunosPC.style.display === 'none' && width > 500){
    tbAlunosPC.style.display = 'block';
    tbProfessoresPC.style.display = 'none';
    tbProfessoresPHONE.style.display = 'none';
  }
  else if(tbAlunosPHONE.style.display === 'none' && width < 500){
    tbAlunosPHONE.style.display = 'block';
    tbProfessoresPC.style.display = 'none';
    tbProfessoresPHONE.style.display = 'none';
  }
  else{
    tbAlunosPC.style.display = 'none';
    tbAlunosPHONE.style.display = 'none';
  }
}

////////////////////////////////////////////////////////