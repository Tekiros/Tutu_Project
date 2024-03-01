const deleteUser = document.querySelector(".deleteProfileBtn");
const modal = document.getElementById("myModal");
const confirmBtn = document.getElementById("confirmBtn");
const closeModal = document.querySelector(".closeModal");
const btnVoltar = document.querySelector('.btnVoltar');

deleteUser.addEventListener("click", (e)=>{
  e.preventDefault();
  modal.style.display = "block";
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