const aviso = document.querySelector('.avisoVerify');
const avisos = document.querySelector('.avisos');
const titleH2 = document.getElementById('h2AviSo');

function verifyAviso() {
  if(!aviso){
  avisos.style.display = 'none'
}
}
verifyAviso()