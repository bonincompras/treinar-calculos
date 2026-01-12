let numeros = [];
let operacoes = [];
let consecutivos = 0;
let recorde = localStorage.getItem('recorde') || 0;
let tempoInicio = Date.now();

document.getElementById('recorde').textContent = recorde;

// Função para gerar números e operações
function gerarNumeros() {
  const maxValor = parseInt(document.getElementById('maxValor').value) || 50;
  const maxNumeros = parseInt(document.getElementById('maxNumeros').value) || 5;

  // Pega operações selecionadas
  const opDisponiveis = [];
  if(document.getElementById('add').checked) opDisponiveis.push('+');
  if(document.getElementById('sub').checked) opDisponiveis.push('-');
  if(document.getElementById('mul').checked) opDisponiveis.push('*');
  if(document.getElementById('div').checked) opDisponiveis.push('/');

  if(opDisponiveis.length === 0) {
    alert("Selecione ao menos uma operação!");
    return;
  }

  // Probabilidade linear para quantidade de números
  const minNumeros = 2;
  const qtdOpcoes = maxNumeros - minNumeros + 1;
  const rand = Math.random();
  const index = Math.floor(rand * qtdOpcoes); 
  const quantidade = minNumeros + index;

  // Gera números aleatórios
  numeros = [];
  for (let i = 0; i < quantidade; i++) {
    numeros.push(Math.floor(Math.random() * maxValor) + 1);
  }

  // Gera operações aleatórias para cada posição
  operacoes = [];
  for (let i = 0; i < quantidade - 1; i++) {
    const op = opDisponiveis[Math.floor(Math.random() * opDisponiveis.length)];
    operacoes.push(op);
  }

  // Monta a expressão para mostrar ao usuário
  let expressao = '' + numeros[0];
  for(let i = 1; i < numeros.length; i++) {
    expressao += ` ${operacoes[i-1]} ${numeros[i]}`;
  }

  document.getElementById('soma').textContent = expressao;
  document.getElementById('resposta').value = '';
  document.getElementById('resposta').focus();

  tempoInicio = Date.now();
  document.getElementById('timer').textContent = 'Tempo: 0s';
}

// Avalia a expressão sequencialmente
function calcularExpressao() {
  let resultado = numeros[0];
  for(let i = 1; i < numeros.length; i++) {
    const n = numeros[i];
    const op = operacoes[i-1];
    if(op === '+') resultado += n;
    else if(op === '-') resultado -= n;
    else if(op === '*') resultado *= n;
    else if(op === '/') {
      // divisão inteira, evita divisão por zero
      resultado = n !== 0 ? Math.floor(resultado / n) : resultado;
    }
  }
  return resultado;
}

// Atualiza timer
setInterval(() => {
  const tempoAtual = Math.floor((Date.now() - tempoInicio) / 1000);
  document.getElementById('timer').textContent = `Tempo: ${tempoAtual}s`;
}, 100);

// Verifica resposta
function verificar() {
  const respostaInput = document.getElementById('resposta');
  const feedback = document.getElementById('feedback');
  const inputField = document.getElementById('resposta');
  const respostaUsuario = parseInt(respostaInput.value);
  const respostaCorreta = calcularExpressao();

  if (respostaUsuario === respostaCorreta) {
    feedback.textContent = '✅ Correto!';
    feedback.style.color = 'green';
    inputField.style.backgroundColor = '#c8f7c5';
    consecutivos++;
    if (consecutivos > recorde) {
      recorde = consecutivos;
      localStorage.setItem('recorde', recorde);
      document.getElementById('recorde').textContent = recorde;
    }
  } else {
    feedback.textContent = `❌ Errado. Resposta correta: ${respostaCorreta}`;
    feedback.style.color = 'red';
    inputField.style.backgroundColor = '#f7c5c5';
    consecutivos = 0;
  }

  document.getElementById('consecutivos').textContent = consecutivos;

  setTimeout(() => {
    inputField.style.backgroundColor = 'white';
    gerarNumeros();
  }, 1000);
}

// Eventos
document.getElementById('okBtn').addEventListener('click', verificar);
document.getElementById('resposta').addEventListener('keydown', function(event) {
  if(event.key === 'Enter') verificar();
});

// Inicia treino
gerarNumeros();
