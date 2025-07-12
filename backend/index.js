const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'tarefas.json');

function lerTarefas() {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function salvarTarefas(tarefas) {
  fs.writeFileSync(DB_PATH, JSON.stringify(tarefas, null, 2));
}

// Listar todas (exceto removidas)
app.get('/tarefas', (req, res) => {
  const tarefas = lerTarefas().filter(t => !t.removida);
  res.json(tarefas);
});

// Listar removidas
app.get('/tarefas/removidas', (req, res) => {
  const tarefas = lerTarefas().filter(t => t.removida);
  res.json(tarefas);
});

// Criar tarefa
app.post('/tarefas', (req, res) => {
  const tarefas = lerTarefas();
  const nova = {
    id: Date.now(),
    texto: req.body.texto,
    feita: false,
    removida: false
  };
  tarefas.push(nova);
  salvarTarefas(tarefas);
  res.status(201).json(nova);
});

// Concluir / Desconcluir / Restaurar
app.put('/tarefas/:id', (req, res) => {
  const tarefas = lerTarefas();
  const tarefa = tarefas.find(t => t.id == req.params.id);
  if (tarefa) {
    if (req.body.restaurar) {
      tarefa.removida = false;
      tarefa.feita = false; // opcional, pode restaurar como pendente
    } else {
      tarefa.feita = !tarefa.feita;
    }
    salvarTarefas(tarefas);
    res.json(tarefa);
  } else {
    res.status(404).send('Tarefa não encontrada');
  }
});

// Marcar como removida
app.delete('/tarefas/:id', (req, res) => {
  const tarefas = lerTarefas();
  const tarefa = tarefas.find(t => t.id == req.params.id);
  if (tarefa) {
    tarefa.removida = true;
    salvarTarefas(tarefas);
    res.json({ sucesso: true });
  } else {
    res.status(404).send('Tarefa não encontrada');
  }
});

// Esvaziar lixeira
app.delete('/tarefas/removidas/todas', (req, res) => {
  let tarefas = lerTarefas();
  tarefas = tarefas.filter(t => !t.removida);
  salvarTarefas(tarefas);
  res.json({ sucesso: true });
});

// Deletar tarefa permanentemente (da lixeira)
app.delete('/tarefas/permanente/:id', (req, res) => {
  let tarefas = lerTarefas();
  const tarefaIndex = tarefas.findIndex(t => t.id == req.params.id);
  if (tarefaIndex !== -1) {
    tarefas.splice(tarefaIndex, 1);
    salvarTarefas(tarefas);
    res.json({ sucesso: true });
  } else {
    res.status(404).send('Tarefa não encontrada');
  }
});


app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
