const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings')

chai.use(chaiHttp);

const BASE_PATH_SOLVE = '/api/solve'
const BASE_PATH_CHECK = '/api/check'

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai.request(server)
            .post(BASE_PATH_SOLVE)
            .set('Contente-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0] })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'solution', 'Should be the solution in property')
                assert.isString(res.body.solution, "Should be string type")
                assert.equal(res.body.solution, puzzlesAndSolutions[1][1])
                done()
            })
    })

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai.request(server)
            .post(BASE_PATH_SOLVE)
            .set('Content-Type', 'application/json')
            .send({ puzzle: ''})
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.isString(res.body.error, 'Should be sting type')
                assert.equal(res.body.error, 'Required field missing')
                done()
            })
    })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai.request(server)
            .post(BASE_PATH_SOLVE)
            .set('Content-Type', 'application/json')
            .send({ puzzle: 'a.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.isString(res.body.error, 'Should be sting type')
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
    })


    test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        chai.request(server)
            .post(BASE_PATH_SOLVE)
            .set('Content-Type', 'application/json')
            .send({ puzzle: '6.62.71...9......1945....4.37.4.3..6..' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.isString(res.body.error, 'Should be sting type')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
    })

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai.request(server)
            .post(BASE_PATH_SOLVE)
            .set('Content-Type', 'application/json')
            .send({ puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.isString(res.body.error, 'Should be sting type')
                assert.equal(res.body.error, 'Puzzle cannot be solved')
                done()
            })
    })

    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a2', value: '4' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid', 'Should be exists valid property')
                assert.isBoolean(res.body.valid, 'Should be boolean type')
                assert.isTrue(res.body.valid)
                done()
            })
    })

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a2', value: '1' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid', 'Should be exists valid property')
                assert.isBoolean(res.body.valid, 'Should be boolean type')
                assert.isFalse(res.body.valid)
                assert.property(res.body, 'conflict', 'Should be exists conflict property')
                assert.isNotEmpty(res.body.conflict, 'Should be an array')
                done()
            })
    })    

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a2', value: '3' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid', 'Should be exists valid property')
                assert.isBoolean(res.body.valid, 'Should be boolean type')
                assert.isFalse(res.body.valid)
                assert.property(res.body, 'conflict', 'Should be exists conflict property')
                assert.isAtMost(res.body.conflict.length, 2, "Should be have almost two conflicts")
                done()
            })
    })
    
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a2', value: '9' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'valid', 'Should be exists valid property')
                assert.isBoolean(res.body.valid, 'Should be boolean type')
                assert.isFalse(res.body.valid)
                assert.property(res.body, 'conflict', 'Should be exists conflict property')
                assert.includeMembers(res.body.conflict, ['row', 'column', 'region'])
                done()
            })
    })

    test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.equal(res.body.error, 'Required field(s) missing')
                done()
            })
    })

    test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a2', value: 'a' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.equal(res.body.error, 'Invalid value')
                done()
            })
    })

    test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.', coordinate: 'a2', value: '1' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
    })

     test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a22', value: '1' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.equal(res.body.error, 'Invalid coordinate')
                done()
            })
    })

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        chai.request(server)
            .post(BASE_PATH_CHECK)
            .set('Content-Type', 'application/json')
            .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'a2', value: '11' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'error', 'Should be exists error property')
                assert.equal(res.body.error, 'Invalid value')
                done()
            })
    })
});

