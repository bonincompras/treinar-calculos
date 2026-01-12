let numeros = [];
let consecutivos = 0;
let recorde = localStorage.getItem('recorde') || 0;
let tempoInicio = Date.now();

document.getElementById('recorde').textContent = recorde;

// Função para gerar números aleatórios
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

  // Reinicia o timer
  tempoInicio = Date.now();
  document.getElementById('timer').textContent = 'Tempo: 0s';
}

// Atualiza o timer a cada 0.1s
setInterval(() => {
  const tempoAtual = Math.floor((Date.now() - tempoInicio) / 1000);
  document.getElementById('timer').textContent = `Tempo: ${tempoAtual}s`;
}, 100);

// Função para verificar a resposta
function verificar() {
  const respostaInput = document.getElementById('resposta');
  const feedback = document.getElementById('feedback');
  const inputField = document.getElementById('resposta');
  const respostaUsuario = parseInt(respostaInput.value);
  const respostaCorreta = numeros.reduce((a, b) => a + b, 0);

  if (respostaUsuario === respostaCorreta) {
    feedback.textContent = '✅ Correto!';
    feedback.style.color = 'green';
    inputField.style.backgroundColor = '#c8f7c5'; // verde claro
    consecutivos++;
    if (consecutivos > recorde) {
      recorde = consecutivos;
      localStorage.setItem('recorde', recorde);
      document.getElementById('recorde').textContent = recorde;
    }
  } else {
    feedback.textContent = `❌ Errado. Resposta correta: ${respostaCorreta}`;
    feedback.style.color = 'red';
    inputField.style.backgroundColor = '#f7c5c5'; // vermelho claro
    consecutivos = 0;
  }

  document.getElementById('consecutivos').textContent = consecutivos;

  // Nova soma após 1s, e reseta cor do input
  setTimeout(() => {
    inputField.style.backgroundColor = 'white';
    gerarNumeros();
  }, 1000);
}

// Evento do botão
document.getElementById('okBtn').addEventListener('click', verificar);

// Inicia o treino
gerarNumeros();
