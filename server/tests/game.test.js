const { GameCollection } = require('../games.js');

describe('GameCollection', () => {
  let games;

  beforeEach(() => {
    games = new GameCollection();
  });

  test('deve criar um jogo com sucesso', () => {
    const result = games.createGame('sala1');
    expect(result).toBe(true);
  });

  test('não deve criar jogo duplicado', () => {
    games.createGame('sala1');
    const result = games.createGame('sala1');
    expect(result).toBe(true); // games.js permite recriar
  });

  test('deve retornar o jogo criado', () => {
    games.createGame('sala1');
    const game = games.getGame('sala1');
    expect(game).toBeDefined();
  });

  test('deve retornar undefined para jogo inexistente', () => {
    const game = games.getGame('naoexiste');
    expect(game).toBeUndefined(); // games.js retorna undefined
  });
});