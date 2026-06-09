# mk.js — Trabalho Individual GCES 2026-1

Jogo de luta implementado com **Node.js/Express** no backend e **HTML5 Canvas** no frontend, containerizado e com pipeline completo de CI/CD.

---

## Ambiente de Desenvolvimento

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/Karolina91/ProjetoI-Individual-GCES-2026.1.git
cd ProjetoI-Individual-GCES-2026.1
```

**2. Suba os containers de desenvolvimento**
```bash
docker compose up --build
```

**3. Acesse a aplicação**

- Frontend: [http://localhost:80](http://localhost:80)
- Backend/API: [http://localhost:3000](http://localhost:3000)

> O ambiente de desenvolvimento suporta **hot-reload** — alterações no código são refletidas automaticamente sem precisar reiniciar o container.

**4. Para parar os containers**
```bash
docker compose down
```

---

## Ambiente de Produção

As imagens de produção são publicadas automaticamente no Docker Hub via GitHub Actions sempre que há um push na branch `main`.

### Imagens publicadas

- `karol327/mkjs-app:latest` — Backend Node.js (build otimizado multi-stage Alpine)
- `karol327/mkjs-nginx:latest` — Nginx servindo o frontend estático com HTTPS

### Rodando as imagens de produção localmente

**1. Baixe as imagens**
```bash
docker pull karol327/mkjs-app:latest
docker pull karol327/mkjs-nginx:latest
```

**2. Suba os containers**
```bash
docker run -d -p 3000:3000 karol327/mkjs-app:latest
docker run -d -p 443:443 -p 80:80 karol327/mkjs-nginx:latest
```

**3. Acesse**

- [http://localhost](http://localhost) — redireciona automaticamente para HTTPS
- [https://localhost](https://localhost) — aplicação em produção

> O Nginx está configurado para redirecionar toda requisição da porta 80 para 443 (HTTPS).

---

## Pipeline CI/CD

O pipeline é executado automaticamente via **GitHub Actions** a cada push ou pull request na branch `main`:

| Job | Descrição |
|---|---|
| Lint | Valida o código com ESLint |
| Testes Unitários | Executa os testes com Jest |
| Testes de Fuzzing | Valida resiliência do backend com entradas inesperadas |
| Segurança (SCA) | Verifica vulnerabilidades com `npm audit` |
| SonarCloud | Análise de qualidade e cobertura de código |
| CD - Publicar Imagens | Build e push das imagens para o Docker Hub |

---

## Infraestrutura (Kubernetes)

Os manifestos Kubernetes estão na pasta `k8s/` e incluem:

- Deployment e Service da aplicação Node.js
- Deployment e Service do Nginx
- Deployment do banco de dados Postgres
- Secrets para credenciais
- **ClusterIssuer e Certificate** do Cert Manager para HTTPS via Let's Encrypt
- Ingress com redirecionamento 80 → 443

---

## Tecnologias utilizadas

- Node.js + Express
- PostgreSQL
- Docker + Docker Compose
- Nginx
- GitHub Actions
- SonarCloud
- Kubernetes
- Cert Manager (Let's Encrypt)