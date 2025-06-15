const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')

let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', function () {
        const result = solver.validate(puzzlesAndSolutions[0][0])
        assert.property(result, 'valid', 'Sould be have a valid property')
        assert.isBoolean(result.valid, 'Should be boolean')
        assert.isTrue(result.valid, 'Should be true')
    })

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        const result = solver.validate('1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
        assert.property(result, 'error', 'Should be received an error message')
        assert.equal(result.error, 'Invalid characters in puzzle', 'Should be display value of error message')
    })

    test('Logic handles a puzzle string that is not 81 characters in length', function () {
        const result = solver.validate('123456')
        assert.property(result, 'error', 'Should be received an error message')
        assert.equal(result.error, 'Expected puzzle to be 81 characters long', 'Should be display value of error message')
    })

    test('Logic handles a valid row placement', function () {
        const result = solver.checkRowPlacement(puzzlesAndSolutions[0][0], 'a', '2', '3')
        assert.property(result, 'valid', 'Sould be have a valid property')
        assert.isBoolean(result.valid, 'Should be boolean')
        assert.isTrue(result.valid, 'Should be true')
    })

    test('Logic handles an invalid row placement', function () {
        const result = solver.checkRowPlacement(puzzlesAndSolutions[0][0], 'a', '2', '5')
        assert.property(result, 'valid', 'Sould be have a valid property')
        assert.isBoolean(result.valid, 'Should be boolean')
        assert.isNotTrue(result.valid, 'Should be false')
        assert.property(result, 'conflict', 'Should be a conflict error message')
        assert.include(result.conflict, 'row', 'Shoul be include row in the confilct array')
    })

    test('Logic handles a valid column placement', function () {
        const result = solver.checkColPlacement(puzzlesAndSolutions[0][0], 'c', '1', '9')
        assert.property(result, 'valid', 'Shluld be exists property valid')
        assert.isBoolean(result.valid, "Should be a boolean type")
        assert.isTrue(result.valid, 'Should be a true')
    })

    test('Logic handles an invalid column placement', function () {
        const result = solver.checkColPlacement(puzzlesAndSolutions[0][0], 'c', '1', '2')
        assert.property(result, 'valid', 'Should be exists a property valid')
        assert.isBoolean(result.valid, 'Should be a boolean type')
        assert.isNotTrue(result.conflict, 'Should be false')
        assert.property(result, 'conflict', 'Should be a conflict property')
        assert.include(result.conflict, 'column', 'Should be include column in the conflict array')
    })

    test('Logic handles a valid region (3x3 grid) placement', function () {
        const result = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 'b', '2', '4')
        assert.property(result, 'valid', 'Shluld be exists property valid')
        assert.isBoolean(result.valid, "Should be a boolean type")
        assert.isTrue(result.valid, 'Should be a true')
    })

    test('Logic handles an invalid region (3x3 grid) placement', function () {
        const result = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 'b', '2', '2')
        assert.property(result, 'valid', 'Should be exists a property valid')
        assert.isBoolean(result.valid, 'Should be a boolean type')
        assert.isNotTrue(result.conflict, 'Should be false')
        assert.property(result, 'conflict', 'Should be a conflict property')
        assert.include(result.conflict, 'region', 'Should be include column in the region array')
    })

    test('Valid puzzle strings pass the solver', function () {
        const result = solver.solve(puzzlesAndSolutions[0][0])
        assert.isNotNull(result, 'Shoul be not an empty result')
        assert.isObject(result, 'Shoul be an object')
    })

    test('Invalid puzzle strings fail the solver', function () {
        const result = solver.solve('..9.55.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')
        assert.property(result, 'error', 'Should be exists an error message')
        assert.equal(result.error, 'Puzzle cannot be solved', 'Should be return string error message')
    })

    test('Solver returns the expected solution for an incomplete puzzle', function () {
        const result = solver.solve(puzzlesAndSolutions[0][0])
        assert.property(result, 'solution', 'Should be the puzzle solution')
        assert.equal(result.solution, puzzlesAndSolutions[0][1], 'Should be contains the sting solution')
    })
});
