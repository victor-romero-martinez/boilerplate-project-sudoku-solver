'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body

      if (!puzzle || !coordinate || !value) return res.json({ "error": "Required field missing" })
      if (coordinate.length !== 2) return res.json({ "error": "Invalid coordinate" })

      const result = solver.check(puzzle, coordinate[0], coordinate[1], value)
      res.json(result)
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body

      if (!puzzle) return res.json({ "error": "Required field missing" })

      const result = solver.solve(puzzle)
      res.json(result)
    });
};
