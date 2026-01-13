let numeros = [];
let operacoes = [];
let consecutivos = 0;

let recorde = JSON.parse(localStorage.getItem('recorde')) || {
  valor: 0,
  tempoMedio: 0
};

// ===== Controle de tempo =====
let tempoInicio = 0;
let tempoAcumulado = 0;
let timerAtivo = true;

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
// Calcula resultado parcial
// ========================
function calcularResultadoParcial(nums, ops) {
  let resultado = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    const op = ops[i - 1];

    if (op === '+') resultado += n;
    else if (op === '-') resultado -= n;
    else if (op === '*') resultado *= n;
    else break;
  }

  return resultado;
}

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
  const quantidade =
    Math.floor(Math.random() * (maxNumeros - minNumeros + 1)) + minNumeros;

  numeros = [];
  operacoes = [];

  // Primeiro número
  numeros.push(Math.floor(Math.random() * maxValor) + 1);

  for (let i = 1; i < quantidade; i++) {
    let op = opDisponiveis[Math.floor(Math.random() * opDisponiveis.length)];
    let num = Math.floor(Math.random() * maxValor) + 1;

    // ===== Multiplicação (controle de tamanho)
    if (op === '*') {
      const limite = 100;
      if (numeros[i - 1] * num > limite) {
        num = Math.max(2, Math.floor(limite / numeros[i - 1]));
      }
    }

    // ===== Divisão baseada no resultado acumulado
    if (op === '/') {
      const resultadoParcial = calcularResultadoParcial(
        numeros.slice(0, i),
        operacoes
      );

      let tentativas = 0;
      while (
        num > 1 &&
        resultadoParcial % num !== 0 &&
        tentativas < 20
      ) {
        num = Math.floor(Math.random() * 10) + 2;
        tentativas++;
      }

      // Se não encontrou divisor válido, troca a operação
      if (resultadoParcial % num !== 0) {
        op = '+';
      }
    }

    operacoes.push(op);
    numeros.push(num);
  }

  // Mostra expressão
  let expressao = '' + numeros[0];
  for (let i = 1; i < numeros.length; i++) {
    expressao += ` ${operacoes[i - 1]} ${numeros[i]}`;
  }

  document.getElementById('soma').textContent = expressao;
  document.getElementById('resposta').value = '';
  document.getElementById('resposta').focus();

  // Reinicia tempo
  tempoInicio = Date.now();
  tempoAcumulado = 0;
  timerAtivo = !document.hidden;
}

// ========================
// Calcula expressão final
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
  if (!timerAtivo) return;

  const agora = Date.now();
  const tempo = Math.floor((tempoAcumulado + (agora - tempoInicio)) / 1000);
  document.getElementById('timer').textContent = `Tempo: ${tempo}s`;
}, 100);

// ========================
// Detecta foco da aba
// ========================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    tempoAcumulado += Date.now() - tempoInicio;
    timerAtivo = false;
  } else {
    tempoInicio = Date.now();
    timerAtivo = true;
  }
});

// ========================
// Verifica resposta
// ========================
function verificar() {
  const input = document.getElementById('resposta');
  const feedback = document.getElementById('feedback');

  const respostaUsuario = Number(input.value);

  if (!Number.isInteger(respostaUsuario)) {
    feedback.textContent = '⚠️ Digite um número inteiro válido';
    feedback.style.color = 'orange';
    return;
  }

  const tempoResposta =
    (tempoAcumulado + (Date.now() - tempoInicio)) / 1000;

  const respostaCorreta = calcularExpressao();

  let expressao = '' + numeros[0];
  for (let i = 1; i < numeros.length; i++) {
    expressao += ` ${operacoes[i - 1]} ${numeros[i]}`;
  }
  expressao += ` = ${respostaUsuario}`;

  if (respostaUsuario === respostaCorreta) {
    feedback.innerHTML = `${expressao}<br>✅ <strong>Correto!</strong>`;
    feedback.style.color = 'green';

    consecutivos++;
    temposCorretos.push(tempoResposta);

    if (consecutivos > recorde.valor) {
      const media =
        temposCorretos.reduce((a, b) => a + b, 0) / temposCorretos.length;

      recorde = { valor: consecutivos, tempoMedio: media };
      localStorage.setItem('recorde', JSON.stringify(recorde));
      atualizarRecordeTela();
    }
  } else {
    feedback.innerHTML =
      `${expressao}<br>❌ Errado. Correto: <strong>${respostaCorreta}</strong>`;
    feedback.style.color = 'red';

    consecutivos = 0;
    temposCorretos = [];
  }

  document.getElementById('consecutivos').textContent = consecutivos;
  setTimeout(gerarNumeros, 1200);
}

// ========================
// Bloqueio de input
// ========================
document.getElementById('resposta').addEventListener('input', function () {
  let valor = this.value.replace(/[^0-9]/g, '');
  this.value = valor;
});

// ========================
// Eventos
// ========================
document.getElementById('okBtn').addEventListener('click', verificar);
document.getElementById('resposta').addEventListener('keydown', e => {
  if (e.key === 'Enter') verificar();
});

// ========================
// Início
// ========================
gerarNumeros();
