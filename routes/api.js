'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body
      const result = solver.check(puzzle, coordinate, value)
      res.json(result)
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body
      const result = solver.solve(puzzle)
      res.json(result)
    });
};
