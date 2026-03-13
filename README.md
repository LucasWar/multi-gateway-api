<!-- HEADER -->

<h1 align="center">
Payment Processing API
</h1>

<p align="center">
API de processamento de pagamentos desenvolvida como teste técnico.<br>
Simula uma plataforma capaz de processar compras utilizando <b>múltiplos gateways</b> com <b>failover automático</b>.
</p>

<p align="center">

<img src="https://img.shields.io/badge/Node.js-18+-green">
<img src="https://img.shields.io/badge/Framework-AdonisJS-purple">
<img src="https://img.shields.io/badge/Database-MySQL-blue">
<img src="https://img.shields.io/badge/Tests-Japa-orange">
<img src="https://img.shields.io/badge/Docker-ready-blue">

</p>

---

<h2>📚 Sumário</h2>

<ul>
<li><a href="#visao">Visão Geral</a></li>
<li><a href="#tech">Tecnologias</a></li>
<li><a href="#arquitetura">Arquitetura</a></li>
<li><a href="#fluxo">Fluxo de Pagamento</a></li>
<li><a href="#quick">Quick Start</a></li>
<li><a href="#install">Instalação Completa</a></li>
<li><a href="#seeds">Seeds</a></li>
<li><a href="#auth">Autenticação</a></li>
<li><a href="#rbac">RBAC</a></li>
<li><a href="#routes">Rotas</a></li>
<li><a href="#tests">Testes</a></li>
<li><a href="#architecture-decisions">Decisões de Arquitetura</a></li>
</ul>

---

<h2 id="visao">📌 Visão Geral</h2>

<p>
A API permite:
</p>

<ul>
<li>Criar transações de compra</li>
<li>Processar pagamentos utilizando múltiplos gateways</li>
<li>Realizar reembolsos</li>
<li>Gerenciar produtos</li>
<li>Gerenciar gateways</li>
<li>Autenticar usuários</li>
<li>Controlar permissões via <b>RBAC</b></li>
</ul>

<p>
Durante o processamento de pagamento, o sistema utiliza os gateways respeitando a <b>prioridade configurada</b>.
Caso um gateway falhe, o sistema tenta automaticamente o <b>próximo gateway disponível</b>.
</p>

---

<h2 id="tech">🧱 Tecnologias Utilizadas</h2>

<table>
<tr>
<th>Tecnologia</th>
<th>Descrição</th>
</tr>

<tr>
<td>Node.js</td>
<td>Runtime JavaScript</td>
</tr>

<tr>
<td>AdonisJS</td>
<td>Framework backend</td>
</tr>

<tr>
<td>MySQL</td>
<td>Banco de dados relacional</td>
</tr>

<tr>
<td>Docker</td>
<td>Containerização da aplicação</td>
</tr>

<tr>
<td>Japa</td>
<td>Framework de testes</td>
</tr>

<tr>
<td>Sinon</td>
<td>Mocking e stubs para testes</td>
</tr>

</table>

---

<h2 id="arquitetura">🏗 Arquitetura do Projeto</h2>

<p>O projeto segue uma arquitetura em camadas:</p>

<pre>
Controller
   ↓
Service
   ↓
Model
   ↓
Database
</pre>

<h3>Controllers</h3>

<ul>
<li>Recebem requisições HTTP</li>
<li>Validam dados</li>
<li>Delegam lógica para os services</li>
</ul>

<h3>Services</h3>

<p>Contêm as <b>regras de negócio</b> da aplicação.</p>

<ul>
<li>Checkout</li>
<li>Fallback entre gateways</li>
<li>Regras de reembolso</li>
</ul>

<h3>Models</h3>

<p>Representam entidades do banco utilizando o ORM do AdonisJS.</p>

---

<h2 id="fluxo">💳 Fluxo de Processamento de Pagamento</h2>

<pre>
Cliente envia requisição
        ↓
Sistema busca produtos
        ↓
Calcula valor total
        ↓
Cria ou recupera cliente
        ↓
Busca gateways ativos
        ↓
Tenta processar pagamento
        ↓
Gateway falhou?
   ↙          ↘
Sim            Não
↓               ↓
Tenta próximo   Transação criada
gateway
</pre>

<p>
Esse mecanismo garante <b>maior resiliência no processamento de pagamentos</b>.
</p>

---

<h2>📋 Requisitos</h2>

<ul>
<li>Node.js 18+</li>
<li>Docker</li>
<li>Docker Compose</li>
<li>MySQL</li>
</ul>

---

<h2 id="quick">🚀 Quick Start</h2>

<pre>
docker-compose up -d

npm install

node ace migration:run

node ace db:seed

node ace serve --watch
</pre>

<p>A API estará disponível em:</p>

<pre>
http://localhost:3333
</pre>

---

<h2 id="install">⚙️ Instalação Completa</h2>

<h3>1. Clonar o repositório</h3>

<pre>
git clone &lt;repo-url&gt;
cd payment-api
</pre>

<h3>2. Instalar dependências</h3>

<pre>
npm install
</pre>

<h3>3. Configurar ambiente</h3>

<pre>
cp .env.example .env
</pre>

Exemplo:

<pre>
DB_DATABASE=betalent_api
DB_USER=root
DB_PASSWORD=root
</pre>

<h3>4. Subir containers</h3>

<pre>
docker-compose up -d
</pre>

<h3>5. Rodar migrations</h3>

<pre>
node ace migration:run
</pre>

<h3>6. Rodar seeds</h3>

<pre>
node ace db:seed
</pre>

<h3>7. Iniciar servidor</h3>

<pre>
node ace serve --watch
</pre>

---

<h2 id="seeds">🌱 Seeds</h2>

Seeders disponíveis:

<ul>
<li><code>initial_datum_seeder</code></li>
<li><code>user_seeder</code></li>
</ul>

<h3>Gateways criados</h3>

<table>

<tr>
<th>Nome</th>
<th>Prioridade</th>
<th>Ativo</th>
</tr>

<tr>
<td>Gateway 1</td>
<td>1</td>
<td>true</td>
</tr>

<tr>
<td>Gateway 2</td>
<td>2</td>
<td>true</td>
</tr>

</table>

---

<h3>Usuários de teste</h3>

<table>

<tr>
<th>Email</th>
<th>Role</th>
</tr>

<tr>
<td>admin@test.com</td>
<td>ADMIN</td>
</tr>

<tr>
<td>manager@test.com</td>
<td>MANAGER</td>
</tr>

<tr>
<td>finance@test.com</td>
<td>FINANCE</td>
</tr>

<tr>
<td>user@test.com</td>
<td>USER</td>
</tr>

</table>

Senha padrão:

<pre>
123456
</pre>

---

<h2 id="auth">🔐 Autenticação</h2>

<p>Login:</p>

<pre>
POST /login
</pre>

Body:

<pre>
{
  "email": "admin@test.com",
  "password": "123456"
}
</pre>

Resposta:

<pre>
{
  "token": "jwt_token"
}
</pre>

Header necessário:

<pre>
Authorization: Bearer TOKEN
</pre>

---

<h2 id="rbac">🔑 Controle de Permissões (RBAC)</h2>

<table>

<tr>
<th>Role</th>
<th>Permissões</th>
</tr>

<tr>
<td>ADMIN</td>
<td>Acesso total</td>
</tr>

<tr>
<td>MANAGER</td>
<td>Gerenciar produtos e visualizar transações</td>
</tr>

<tr>
<td>FINANCE</td>
<td>Gerenciar produtos</td>
</tr>

<tr>
<td>USER</td>
<td>Acesso restrito</td>
</tr>

</table>

---

<h2 id="routes">📡 Rotas da API</h2>

<h3>Checkout</h3>

<pre>
POST /checkout
</pre>

<h3>Transações</h3>

<pre>
GET /transactions
POST /transactions/:id/refund
</pre>

<h3>Produtos</h3>

<pre>
GET /products
POST /products
PUT /products/:id
DELETE /products/:id
</pre>

<h3>Gateways</h3>

<pre>
GET /gateways
POST /gateways/:id/status
POST /gateways/:id/priority
</pre>

---

<h2 id="tests">🧪 Testes</h2>

<p>Executar testes:</p>

<pre>
node ace test
</pre>

Ferramentas utilizadas:

<ul>
<li>Japa</li>
<li>Sinon</li>
</ul>

Os testes utilizam <b>transações globais</b> para garantir isolamento do banco.

---

<h2 id="architecture-decisions">🧠 Decisões de Arquitetura</h2>

<h3>Service Layer</h3>

<p>A lógica de negócio foi isolada em services.</p>

<h3>Gateway Factory</h3>

<p>Permite adicionar novos gateways sem alterar a lógica principal.</p>

<h3>Transações de Banco</h3>

<p>Garantem consistência ao criar transações e itens da transação.</p>
