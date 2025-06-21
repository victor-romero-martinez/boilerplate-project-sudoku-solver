'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' }); // ✅ Aquí primero
      }

      const result = solver.solve(puzzle);
      res.json(result);
    });


  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' }); // ✅ Aquí primero
      }

      const result = solver.check(puzzle, coordinate, value);
      res.json(result);
    });
};
