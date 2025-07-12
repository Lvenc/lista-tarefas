# Lista de Tarefas

Projeto simples de lista de tarefas com funcionalidades de criar, concluir, mover para lixeira e restaurar tarefas. Feito com Node.js no backend (Express) e frontend puro em HTML, CSS e JavaScript.

---

## Funcionalidades

- Criar tarefas
- Marcar tarefas como concluídas
- Mover tarefas para a lixeira (remoção lógica)
- Restaurar tarefas da lixeira
- Visualizar tarefas pendentes, concluídas e removidas (lixeira)
- Esvaziar lixeira (remoção definitiva)

---

## Tecnologias

- Backend: Node.js, Express
- Frontend: HTML, CSS (layout roxo moderno), JavaScript (fetch API)
- Armazenamento: arquivo JSON simples (`tarefas.json`)

---

## Como rodar
```bash
1. Clone o repositório:
git clone https://github.com/Lvenc/lista-tarefas.git

2. Entre na pasta do projeto:
cd lista-tarefas

3. Instale as dependências do backend:
npm install

4. Inicie o servidor backend:
node index.js

5. Abra o arquivo index.html no navegador (ou use Live Server) para acessar o frontend.
