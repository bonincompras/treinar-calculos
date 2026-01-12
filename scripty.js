let numeros = [];
let consecutivos = 0;
let recorde = localStorage.getItem('recorde') || 0;

document.getElementById('recorde').textContent = recorde;

function gerarNumeros() {
  const chance = Math.random();
  let quantidade;

  if (chance < 0.3) {
    quantidade = 2;
  } else if (chance < 0.6) {
    quantidade = Math.floor(Math.random() * 3) + 2; // 2 a 4
  } else {
    quantidade = Math.floor(Math.random() * 10) + 1; // 1 a 10
  }

  numeros = [];
  for (let i = 0; i < quantidade; i++) {
    numeros.push(Math.floor(Math.random() * 50) + 1);
  }

  document.getElementById('soma').textContent = numeros.join(' + ');
  document.getElementById('resposta').value = '';
  document.getElementById('resposta').focus();
}

function verificar() {
  const respostaInput = document.getElementById('resposta');
  const feedback = document.getElementById('feedback');
  const respostaUsuario = parseInt(respostaInput.value);
  const respostaCorreta = numeros.reduce((a, b) => a + b, 0);

  if (respostaUsuario === respostaCorreta) {
    feedback.textContent = '✅ Correto!';
    consecutivos++;
    if (consecutivos > recorde) {
      recorde = consecutivos;
      localStorage.setItem('recorde', recorde);
      document.getElementById('recorde').textContent = recorde;
    }
  } else {
    feedback.textContent = `❌ Errado. A resposta correta era ${respostaCorreta}.`;
    consecutivos = 0;
  }

  document.getElementById('consecutivos').textContent = consecutivos;

  setTimeout(gerarNumeros, 1000); // nova soma após 1s
}

// Evento do botão
document.getElementById('okBtn').addEventListener('click', verificar);

// Inicia o treino
gerarNumeros();
