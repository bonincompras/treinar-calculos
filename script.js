function verificar() {
  const input = document.getElementById('resposta');
  const feedback = document.getElementById('feedback');

  const valorTexto = input.value.trim();

  // Campo vazio
  if (valorTexto === '') {
    feedback.textContent = '⚠️ Digite uma resposta';
    feedback.style.color = 'orange';
    return;
  }

  const respostaUsuario = Number(valorTexto);

  // Não é número
  if (!Number.isFinite(respostaUsuario)) {
    feedback.textContent = '⚠️ Digite um número válido';
    feedback.style.color = 'orange';
    return;
  }

  // Não é inteiro
  if (!Number.isInteger(respostaUsuario)) {
    feedback.textContent = '⚠️ Use apenas números inteiros';
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
