# 🚀 Nava Shooting

**Nava Shooting** é um projeto acadêmico _Full Stack_ desenvolvido como requisito de disciplina, focado na criação de uma arquitetura robusta para jogos. O projeto demonstra a implementação de operações **CRUD** (Create, Read, Update, Delete) via API REST, integrando um backend sólido com interfaces de jogo e web.

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/23bf3e4a-598e-4067-b031-dc0941ce20c2" />

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/eefdce96-63e7-42e7-b641-bbb6930a2ea1" />

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/73d368c3-6796-434f-aa6f-c38676e976cd" />

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/87197d2d-f90d-44cd-ae12-c924f725269b" />

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/2ace778a-e869-4d84-982b-d37cc090de97" />




## 📋 Sobre o Projeto

O objetivo central foi desenvolver um servidor capaz de persistir dados cruciais de um jogo de nave, gerenciando desde o cadastro de usuários até a economia do jogo.

O ecossistema do projeto é dividido em três partes:
1.  **Backend (API):** O núcleo do sistema, gerenciando regras de negócio e banco de dados.
2.  **Game Client (Unity):** O jogo onde a ação acontece (consumidor da API).
3.  **Web Dashboard (React):** Interface administrativa e visualização de dados para o usuário via navegador.

---

## 🛠️ Tecnologias Utilizadas

[![My Skills](https://skillicons.dev/icons?i=js,nodejs,mysql,unity,cs,react,css,vscode,visualstudio,postman)](https://skillicons.dev)

* **Backend:** Node.js, Sequelize (ORM), JavaScript, MySQL.
* **Game Engine:** Unity, C#.
* **Frontend Web:** React, CSS.
* **Ferramentas:** VS Code, Visual Studio, Postman.

---

## ⚙️ Funcionalidades do Backend

O backend foi projetado para gerenciar aspectos dinâmicos e persistência de dados:

### 💾 Gestão de Dados e Economia
* **💰 Sistema de Economia:** Gerenciamento de moeda virtual (Wallet), validando transações e saldo.
* **🛍️ Loja de Itens:** CRUD completo para itens do jogo (Power-ups, Skins). Permite criar, listar, atualizar e remover produtos da loja.

### 🏆 Competitividade e Jogadores
* **🧑‍💻 Gerenciamento de Jogadores (User CRUD):**
    * Criação de contas e autenticação.
    * Consulta e atualização de perfis.
    * Exclusão de registros.
* **🌟 Sistema de Ranking:**
    * Registro do **Nível Alcançado** (máximo progresso).
    * Geração de Leaderboard (Tabela de Classificação Global).

---

## 🚧 Status do Projeto

> ⚠️ **Nota:** Este é um projeto acadêmico em desenvolvimento contínuo.

* ✅ **Backend:** Estrutura CRUD e Rotas principais implementadas.
* ✅ **Frontend Web (React):** Interface para visualização de dados implementada.
* 🟡 **Game (Unity):** O jogo base está funcional, porém a integração completa de todas as rotas da API no cliente Unity será concluída em atualizações futuras.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* **Node.js** e **npm** (ou yarn) instalados.
* **MySQL** ou banco de dados compatível configurado.

### 1. Configurando o Backend (API)

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/nava-shooting.git](https://github.com/seu-usuario/nava-shooting.git)
cd nava-shooting/backend # Ajuste o caminho se necessário

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env) com suas credenciais do banco

# Rode o servidor
npm start

# Navegue para a pasta do frontend (do seu projeto React)
cd ../frontend # (se você estava na pasta do backend)

# Instale as dependências do React
npm install

# Inicie a aplicação web em modo de desenvolvimento
npm run dev
# OU
# npm start
