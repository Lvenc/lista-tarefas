const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const botoesFiltro = document.querySelectorAll('.filtros button');

const API_URL = 'http://localhost:3000/tarefas';

let filtroAtual = 'todas';

async function carregarTarefas() {
  // Remove botão esvaziar lixeira se existir para evitar duplicatas
  const btnEsvaziarExistente = document.getElementById('btn-esvaziar');
  if (btnEsvaziarExistente) {
    btnEsvaziarExistente.remove();
  }

  const endpoint = filtroAtual === 'removidas' ? `${API_URL}/removidas` : API_URL;
  const res = await fetch(endpoint);
  const tarefas = await res.json();

  let tarefasFiltradas = tarefas;

  if (filtroAtual === 'pendentes') {
    tarefasFiltradas = tarefas.filter(t => !t.feita && !t.removida);
  } else if (filtroAtual === 'concluidas') {
    tarefasFiltradas = tarefas.filter(t => t.feita && !t.removida);
  }

  listaTarefas.innerHTML = '';

  tarefasFiltradas.forEach(tarefa => {
    const li = document.createElement('li');
    li.classList.toggle('concluida', tarefa.feita);
    if (tarefa.removida) li.classList.add('removida');

    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarefa.texto;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    // Botão concluir (só para tarefas que não estão concluídas e não removidas)
    if (!tarefa.feita && !tarefa.removida) {
      const btnConcluir = document.createElement('button');
      btnConcluir.textContent = '✔';
      btnConcluir.title = 'Concluir tarefa';
      btnConcluir.classList.add('concluir');
      btnConcluir.addEventListener('click', async (e) => {
        e.stopPropagation();
        await fetch(`${API_URL}/${tarefa.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) // toggle feita no backend
        });
        carregarTarefas();
      });
      buttonsContainer.appendChild(btnConcluir);
    }

    // Botão apagar (apagar) — só para tarefas NÃO removidas
    if (!tarefa.removida) {
      const btnApagar = document.createElement('button');
      btnApagar.textContent = '✖';
      btnApagar.title = 'Deletar tarefa';
      btnApagar.classList.add('apagar');
      btnApagar.addEventListener('click', async (e) => {
        e.stopPropagation();
        await fetch(`${API_URL}/${tarefa.id}`, { method: 'DELETE' });
        carregarTarefas();
      });
      buttonsContainer.appendChild(btnApagar);
    }

    // Botão restaurar — só para tarefas removidas e no filtro 'removidas'
    if (tarefa.removida && filtroAtual === 'removidas') {
      const btnRestaurar = document.createElement('button');
      btnRestaurar.textContent = '↩';
      btnRestaurar.title = 'Restaurar tarefa';
      btnRestaurar.classList.add('restaurar');
      btnRestaurar.addEventListener('click', async () => {
        await fetch(`${API_URL}/${tarefa.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restaurar: true })
        });
        carregarTarefas();
      });
      buttonsContainer.appendChild(btnRestaurar);
    }

    li.appendChild(spanTexto);
    li.appendChild(buttonsContainer);
    listaTarefas.appendChild(li);
  });

  // REMOVIDO O BOTÃO ESVAZIAR LIXEIRA daqui (não vai mais aparecer)
}

formTarefa.addEventListener('submit', async (e) => {
  e.preventDefault();
  const texto = inputTarefa.value.trim();
  if (texto && filtroAtual !== 'removidas') {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    });
    inputTarefa.value = '';
    carregarTarefas();
  }
});

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    botoesFiltro.forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    filtroAtual = botao.dataset.filtro;
    carregarTarefas();
  });
});

carregarTarefas();
