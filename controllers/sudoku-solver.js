// @ts-check

const BOARD_SIZE = 3 * 3
const ROW = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']

class SudokuSolver {

  /** @param {string} puzzleString */
  validate(puzzleString) {
    const regex = /[^1-9.]/g
    if (puzzleString.length !== BOARD_SIZE * BOARD_SIZE) return { "error": "Expected puzzle to be 81 characters long" }
    if (regex.test(puzzleString)) return { "error": "Invalid characters in puzzle" }

    return null
  }

  /**
   * @param {string} puzzleString 
   * @param {string | number} row 
   * @param {string | number} column 
   * @param {string} value 
   */
  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = (typeof (row) === 'number' ? row : ROW.indexOf(row.toLowerCase())) * BOARD_SIZE
    const rowEnd = rowStart + BOARD_SIZE
    const puzzleRow = puzzleString.slice(rowStart, rowEnd)
    return puzzleRow.includes(value) ? { "valid": false, "conflict": "row" } : { valid: true }
  }

  /**
   * @param {string} puzzleString 
   * @param {string | number} row 
   * @param {string | number} column 
   * @param {string} value 
   */
  checkColPlacement(puzzleString, row, column, value) {
    const puzzleColumn = []

    for (let i = 0; i < BOARD_SIZE; i++) {
      const idx = i * BOARD_SIZE + Number(column)
      puzzleColumn.push(puzzleString[idx])
    }


    return puzzleColumn.includes(value) ? { "valid": false, "conflict": "column" } : { valid: true }
  }

  /**
   * @param {string} puzzleString 
   * @param {string | number} row 
   * @param {string | number} column 
   * @param {string} value 
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    const REGION_SIZE = BOARD_SIZE / 3
    const fixRow = typeof (row) === 'number' ? row : ROW.indexOf(row.toLocaleLowerCase())
    const regionRow = Math.floor(fixRow / REGION_SIZE)
    const regionCol = Math.floor(Number(column) / REGION_SIZE)
    const regionStartRow = regionRow * REGION_SIZE
    const regionStartCol = regionCol * REGION_SIZE

    for (let i = 0; i < REGION_SIZE; i++) {
      for (let j = 0; j < REGION_SIZE; j++) {
        const idx = (regionStartRow + i) * BOARD_SIZE + regionStartCol + j
        if (puzzleString[idx] === value) {
          return { "valid": false, "conflict": "region" }
        }
      }
    }

    return { valid: true }
  }

  /**
   * 
   * @param {string} puzzleString 
   * @param {string | number} row 
   * @param {string | number} column 
   * @param {string} value 
   * @returns 
   */
  check(puzzleString, row, column, value) {
    const isNotValid = this.validate(puzzleString)
    if (isNotValid) return isNotValid
    if (/[^a-zA-Z]/.test(String(row)) || /[^1-9]/.test(String(column))) return { "error": "Invalid coordinate" }
    if (/[^1-9]/.test(value)) return { "error": "Invalid value" }

    const rowResult = this.checkRowPlacement(puzzleString, row, column, value)
    const colResult = this.checkColPlacement(puzzleString, row, Number(column) - 1, value)
    const regionResult = this.checkRegionPlacement(puzzleString, row, column, value)

    let conflicts = []
    conflicts = [...conflicts, rowResult?.conflict]
    conflicts = [...conflicts, colResult?.conflict]
    conflicts = [...conflicts, regionResult?.conflict]

    const conflict = conflicts.filter(c => c !== undefined)

    return conflict.length > 0 ? { valid: false, conflict } : { valid: true }
  }

  /**
   * @param {string} puzzleString 
   */
  solve(puzzleString) {
    const isNotValid = this.validate(puzzleString)
    if (isNotValid) return isNotValid

    const board = puzzleString.split('')

    const solveRecursive = () => {
      const emptyIdx = board.findIndex(c => c === '.')
      if (emptyIdx === -1) return true

      const row = Math.floor(emptyIdx / BOARD_SIZE)
      const col = emptyIdx % BOARD_SIZE

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
