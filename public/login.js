const emailValue = decodeURIComponent(
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('email='))
    .split('=')[1]
);

if(emailValue){
  document.getElementById('emailInput').value = emailValue;
}