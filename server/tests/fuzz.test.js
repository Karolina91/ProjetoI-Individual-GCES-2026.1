const fc = require('fast-check');
const { GameCollection } = require('../games.js');

describe('Fuzzing - GameCollection', () => {
  
  test('createGame nunca deve lançar exceção com qualquer string', () => {
    fc.assert(
      fc.property(fc.string(), (gameName) => {
        const games = new GameCollection();
        expect(() => games.createGame(gameName)).not.toThrow();
      })
    );
  });

  test('getGame nunca deve lançar exceção com qualquer string', () => {
    fc.assert(
      fc.property(fc.string(), (gameName) => {
        const games = new GameCollection();
        expect(() => games.getGame(gameName)).not.toThrow();
      })
    );
  });

  test('createGame e getGame com entradas aleatórias', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (name1, name2) => {
        const games = new GameCollection();
        expect(() => {
          games.createGame(name1);
          games.createGame(name2);
          games.getGame(name1);
          games.getGame(name2);
        }).not.toThrow();
      })
    );
  });

  test('createGame com tipos inesperados não deve quebrar', () => {
    fc.assert(
      fc.property(fc.oneof(
        fc.string(),
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined)
      ), (input) => {
        const games = new GameCollection();
        expect(() => games.createGame(input)).not.toThrow();
      })
    );
  });
});