import { Game } from "./game.js"

const game = new Game("myPlayer1", "myPlayer2")

console.log(game.board)

game.dropDisc(0, true)
game.dropDisc(1, false)
game.dropDisc(1, false)
game.dropDisc(1, false)
game.dropDisc(1, false)
game.dropDisc(1, false)
game.dropDisc(1, true)
game.dropDisc(1, true)
game.dropDisc(6, true)

console.log(game.board)
