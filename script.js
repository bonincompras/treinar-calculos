let numeros = [];
let operacoes = [];
let consecutivos = 0;

let recorde = JSON.parse(localStorage.getItem('recorde')) || {
  valor: 0,
  tempoMedio: 0
};

let tempoInicio = Date.now();
let temposCorretos = [];

// ========================
// Atualiza recorde na tela
// ========================
function atualizarRecordeTela() {
  document.getElementById('recorde').textContent =
    `${recorde.valor} (${recorde.tempoMedio.toFixed(1)}s)`;
}

atualizarRecordeTela();

// ========================
// Gera números e operações
// ========================
function gerarNumeros() {
  const maxValor = parseInt(document.getElementById('maxValor').value) || 50;
  const maxNumeros = parseInt(document.getElementById('maxNumeros').value) || 5;

  const opDisponiveis = [];
  if (document.getElementById('add').checked) opDisponiveis.push('+');
  if (document.getElementById('sub').checked) opDisponiveis.push('-');
  if (document.getElementById('mul').checked) opDisponiveis.push('*');
  if (document.getElementById('div').checked) opDisponiveis.push('/');

  if (opDisponiveis.length === 0) {
    alert("Selecione ao menos uma operação!");
    return;
  }

  const minNumeros = 2;
  const quantidade = Math.floor(Math.random() * (maxNumeros - minNumeros + 1)) + minNumeros;

  numeros = [];
  for (let i = 0; i < quantidade; i++) {
    numeros.push(Math.floor(Math.random() * maxValor) + 1);
  }

  operacoes = [];
  for (let i = 0; i < quantidade - 1; i++) {
    let op = opDisponiveis[Math.floor(Math.random() * opDisponiveis.length)];
    let n1 = numeros[i];
    let n2 = numeros[i + 1];

    if (op === '/') {
      while (n2 > 1 && n1 % n2 !== 0) n2--;
      if (n1 % n2 !== 0) op = '+';
      numeros[i + 1] = n2;
    }

    operacoes.push(op);
  }

  let expressao = '' + numeros[0];
  for (let i = 1; i < numeros.length; i++) {
    expressao += ` ${operacoes[i - 1]} ${numeros[i]}`;
  }

  document.getElementById('soma').textContent = expressao;
  document.getElementById('resposta').value = '';
  document.getElementById('resposta').focus();

  tempoInicio = Date.now();
}

// ========================
// Calcula expressão
// ========================
function calcularExpressao() {
  let resultado = numeros[0];
  for (let i = 1; i < numeros.length; i++) {
    const n = numeros[i];
    const op = operacoes[i - 1];

    if (op === '+') resultado += n;
    else if (op === '-') resultado -= n;
    else if (op === '*') resultado *= n;
    else if (op === '/') resultado = Math.floor(resultado / n);
  }
  return resultado;
}

// ========================
// Timer
// ========================
setInterval(() => {
  const tempo = Math.floor((Date.now() - tempoInicio) / 1000);
  document.getElementById('timer').textContent = `Tempo: ${tempo}s`;
}, 100);

// ========================
// Verifica resposta
// ========================
function verificar() {
  const input = document.getElementById('resposta');
  const feedback = document.getElementById('feedback');
  const valor = input.value.trim();

  if (valor === '') {
    feedback.textContent = '⚠️ Digite uma resposta';
    feedback.style.color = 'orange';
    return;
  }

  if (!Number.isInteger(Number(valor))) {
    feedback.textContent = '⚠️ Digite um número inteiro';
    feedback.style.color = 'orange';
    return;
  }

  const respostaUsuario = parseInt(valor);
  const respostaCorreta = calcularExpressao();

  if (respostaUsuario === respostaCorreta) {
    feedback.textContent = '✅ Correto!';
    feedback.style.color = 'green';
    consecutivos++;

    const tempoResposta = (Date.now() - tempoInicio) / 1000;
    temposCorretos.push(tempoResposta);

    if (consecutivos > recorde.valor) {
      const media =
        temposCorretos.reduce((a, b) => a + b, 0) / temposCorretos.length;

      recorde = {
        valor: consecutivos,
        tempoMedio: media
      };

      localStorage.setItem('recorde', JSON.stringify(recorde));
      atualizarRecordeTela();
    }
  } else {
    feedback.textContent = `❌ Errado. Resposta correta: ${respostaCorreta}`;
    feedback.style.color = 'red';
    consecutivos = 0;
    temposCorretos = [];
  }

  document.getElementById('consecutivos').textContent = consecutivos;

  setTimeout(gerarNumeros, 1000);
}

// ========================
// 🔒 Bloqueio de letras
// ========================
document.getElementById('resposta').addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9-]/g, '');
});

// ========================
// Eventos
// ========================
document.getElementById('okBtn').addEventListener('click', verificar);

document.getElementById('resposta').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') verificar();
});

// ========================
// Início
// ========================
gerarNumeros();
