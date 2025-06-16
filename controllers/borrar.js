const SudokuSolver = require('./sudoku-solver')
const {puzzlesAndSolutions} = require('./puzzle-strings')


const puzzle = puzzlesAndSolutions[1][0]; // tu puzzle de prueba
const solver = new SudokuSolver();
const result = solver.check(puzzle, 'a2', '4');
console.log(result);
