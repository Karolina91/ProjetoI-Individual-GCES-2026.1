const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { Pool } = require('pg');
const GameCollection = require('./games.js').GameCollection;
const games = new GameCollection();

// Conexão com PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://mkuser:mkpass@localhost:5432/mkjsdb'
});

// Criar tabela se não existir
pool.query(`
  CREATE TABLE IF NOT EXISTS fight_history (
    id SERIAL PRIMARY KEY,
    game_name VARCHAR(100),
    player1_id VARCHAR(100),
    player2_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  )
`).then(() => console.log('DB conectado e tabela pronta'))
  .catch(err => console.error('Erro ao conectar DB:', err));

// Servir arquivos estáticos do frontend
app.use(express.static('/game'));

// Rota para histórico de lutas
app.get('/api/fights', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fight_history ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

const Responses = {
  SUCCESS: 0,
  GAME_EXISTS: 1,
  GAME_NOT_EXISTS: 2,
  GAME_FULL: 3
};

const Requests = {
  CREATE_GAME: 'create-game',
  JOIN_GAME: 'join-game'
};

io.on('connection', function (socket) {
  socket.on(Requests.CREATE_GAME, async function (gameName) {
    if (games.createGame(gameName)) {
      games.getGame(gameName).addPlayer(socket);
      socket.emit('response', Responses.SUCCESS);

      // Salvar no banco
      try {
        await pool.query(
          'INSERT INTO fight_history (game_name, player1_id) VALUES ($1, $2)',
          [gameName, socket.id]
        );
      } catch (err) {
        console.error('Erro ao salvar jogo:', err);
      }
    } else {
      socket.emit('response', Responses.GAME_EXISTS);
    }
  });

  socket.on(Requests.JOIN_GAME, async function (gameName) {
    const game = games.getGame(gameName);
    if (!game) {
      socket.emit('response', Responses.GAME_NOT_EXISTS);
    } else {
      if (game.addPlayer(socket)) {
        socket.emit('response', Responses.SUCCESS);

        // Atualizar player2 no banco
        try {
          await pool.query(
            'UPDATE fight_history SET player2_id = $1 WHERE game_name = $2 AND player2_id IS NULL',
            [socket.id, gameName]
          );
        } catch (err) {
          console.error('Erro ao atualizar jogo:', err);
        }
      } else {
        socket.emit('response', Responses.GAME_FULL);
      }
    }
  });
});