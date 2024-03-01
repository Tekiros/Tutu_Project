const alunos = document.querySelectorAll('.false');

alunos.forEach(aluno =>{
  let h3Aluno = document.createElement('h3');
  
  h3Aluno.textContent = 'Aluno Inativo';
  h3Aluno.style.textAlign = 'center';
  h3Aluno.style.color = 'red';
  aluno.appendChild(h3Aluno);
  aluno.classList.add('no-active');
})