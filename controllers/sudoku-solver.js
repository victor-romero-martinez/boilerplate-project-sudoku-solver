// @ts-check

const BOARD_SIZE = 3 * 3
const ROW = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

class SudokuSolver {

  /** @param {string} puzzleString */
  validate(puzzleString) {
    const regex = /[^1-9.]/g

    if (!puzzleString) return { "error": "Required field missing" }
    if (typeof (puzzleString) !== 'string') return { 'error': 'Expected puzzle should be a string' }
    if (puzzleString.length !== BOARD_SIZE * BOARD_SIZE) return { "error": "Expected puzzle to be 81 characters long" }
    if (regex.test(puzzleString)) return { "error": "Invalid characters in puzzle" }

    return { valid: true }
  }

  /**
   * @param {string} puzzleString 
   * @param {string | number} row Sould be a word `e.g. a`
   * @param {string | number} column Should be a number `e.g 1`
   * @param {string} value 
   */
  checkRowPlacement(puzzleString, row, column, value) {
    const isNotValid = this.validate(puzzleString)
    if (isNotValid.error) return isNotValid

    const rowStart = (typeof (row) === 'number' ? row : ROW.indexOf(row.toLowerCase())) * BOARD_SIZE



    const rowEnd = rowStart + BOARD_SIZE
    const puzzleRow = puzzleString.slice(rowStart, rowEnd)

    if (puzzleRow[Number(column) - 1] === value) return { valid: true }

    return puzzleRow.includes(value) ? { "valid": false, "conflict": "row" } : { valid: true }
  }

  /**
   * @param {string} puzzleString 
   * @param {string | number} row Sould be a word `e.g. a`
   * @param {string | number} column Should be a number `e.g 1`
   * @param {string} value 
   */
  checkColPlacement(puzzleString, row, column, value) {
    const isNotValid = this.validate(puzzleString)
    if (isNotValid.error) return isNotValid

    const fixColumn = Number(column) - 1
    const fixRow = ROW.indexOf(String(row).toLowerCase())
    const puzzleColumn = []

    for (let i = 0; i < BOARD_SIZE; i++) {
      const idx = i * BOARD_SIZE + fixColumn
      puzzleColumn.push(puzzleString[idx])
    }

    if (puzzleColumn[fixRow] === value) return { valid: true }

    return puzzleColumn.includes(value) ? { "valid": false, "conflict": "column" } : { valid: true }
  }

  /**
   * @param {string} puzzleString 
   * @param {string | number} row Sould be a word `e.g. a`
   * @param {string | number} column Should be a number `e.g 1`
   * @param {string} value 
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    const isNotValid = this.validate(puzzleString)
    if (isNotValid.error) return isNotValid

    const REGION_SIZE = BOARD_SIZE / 3
    const fixRow = typeof (row) === 'number' ? row : ROW.indexOf(row.toLocaleLowerCase())
    const fixCol = (Number(column) - 1)

    const targetInx = fixRow * BOARD_SIZE + fixCol

    const regionRow = Math.floor(fixRow / REGION_SIZE)
    const regionCol = Math.floor(fixCol / REGION_SIZE)
    const regionStartRow = regionRow * REGION_SIZE
    const regionStartCol = regionCol * REGION_SIZE

    for (let i = 0; i < REGION_SIZE; i++) {
      for (let j = 0; j < REGION_SIZE; j++) {
        const idx = (regionStartRow + i) * BOARD_SIZE + regionStartCol + j

        if (idx === targetInx) continue

        if (puzzleString[idx] === value) {
          return { "valid": false, "conflict": "region" }
        }
      }
    }

    return { valid: true }
  }

  /**
   * @param {string} puzzleString 
   * @param {string} coordinate Sould be a word `e.g. a1`
   * @param {string} value 
   * @returns 
   */
  check(puzzleString, coordinate, value) {
    if (!puzzleString || !coordinate || !value) return { "error": "Required field(s) missing" }

    const isNotValid = this.validate(puzzleString)
    const [row, column] = coordinate

    if (isNotValid.error) return isNotValid
    if (/[^a-zA-Z]/.test(String(row)) || /[^1-9]/.test(String(column)) || coordinate.length !== 2) return { error: 'Invalid coordinate' }
    if (/[^1-9]/.test(value) || value.length > 1) return { "error": "Invalid value" }
    if (ROW.indexOf(row.toLowerCase()) === -1) return { error: 'Invalid coordinate' }

    const rowResult = this.checkRowPlacement(puzzleString, row, column, value)
    const colResult = this.checkColPlacement(puzzleString, row, column, value)
    const regionResult = this.checkRegionPlacement(puzzleString, row, column, value)

    let conflicts = []
    if (rowResult.conflict) conflicts.push('row')
    if (colResult.conflict) conflicts.push('column')
    if (regionResult.conflict) conflicts.push('region')

    const conflict = conflicts.filter(c => c !== undefined)

    return conflict.length > 0 ? { valid: false, conflict } : { valid: true }
  }

  /**
   * @param {string} puzzleString 
   */
  solve(puzzleString) {
    const isNotValid = this.validate(puzzleString)
    if (isNotValid.error) return isNotValid

    const board = puzzleString.split('')

    const solveRecursive = () => {
      const emptyIdx = board.findIndex(c => c === '.')
      if (emptyIdx === -1) return true

      const row = Math.floor(emptyIdx / BOARD_SIZE)
      const col = emptyIdx % BOARD_SIZE + 1

      for (let num = 1; num <= BOARD_SIZE; num++) {
        const value = num.toString()
        const newBoard = board.join('')

        if (
          this.checkRowPlacement(newBoard, row, col, value).valid &&
          this.checkColPlacement(newBoard, row, col, value).valid &&
          this.checkRegionPlacement(newBoard, row, col, value).valid
        ) {
          board[emptyIdx] = value

          if (solveRecursive()) {
            return true
          }

          board[emptyIdx] = '.'
        }
      }

      return false
    }

    const solved = solveRecursive()

    if (solved) {
      return { solution: board.join('') }
    }

    return { error: "Puzzle cannot be solved" };
  }
}

module.exports = SudokuSolver;
