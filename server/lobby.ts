import { Game } from "./game.ts"
import { Player } from "./player.ts"
import { Server, Socket } from "socket.io"

export class Lobby {
    numRooms: number
    server: Server
    games: Game[]

    constructor(numRooms: number, server: Server) {
        this.numRooms = numRooms
        this.server = server
        this.games = []

        //create one more game so that games can referenced from index 1
        //this makes it easier to interface with the frontend
        //which is also indexed from 1
        //TODO: consider making the zero index a game that's just not used by the frontend
        //      this would avoid certain issues with undefined references in other parts of the code
        for (let i = 1; i < numRooms + 1; i += 1) {
            const roomID = `Room ${i}`
            const game = new Game(roomID, this.server)
            this.games[i] = game
        }
    }

    //adds a new connection to the lobby for managment
    //note: being in the lobby doesn't mean that the user
    //has selected a player slot
    addUser(socket: Socket) {
        const clientID = socket.handshake.auth.id

        //register lobby events
        socket.on("start_lobby", () => {
            socket.join("lobby")
            this.updateLobby()
        })

        socket.on("leave_lobby", () => {
            socket.leave("lobby")
        })

        socket.on("player_left_game", () => {
            this.updateLobby()
        })

        //whenever a client selects a player slot on the client
        //the server updates the lobby state and sends it back to the client
        socket.on("select_slot", ({ roomID, isPlayer1 }) => {
            console.log(`PLAYER IS JOINING AS ISPLAYER1: ${isPlayer1}`)
            const player = new Player(socket, isPlayer1, true)

            //remove player from all games (which removes them from slots as well)
            for (let i = 1; i < this.games.length; i += 1) {
                this.games[i].removePlayer(player)
            }

            //add player to selected game and slot
            //TODO: change to use gameID
            const selectedGame = this.games.filter((game) => {
                return game.roomID === roomID
            })[0]

            selectedGame.addPlayer(player)

            this.updateLobby()
        })

        socket.on("play_again", ({ gameID, isPlayer1 }) => {
            const game = this.games[gameID]

            if (isPlayer1 && game.player1 !== null) {
                game.player1.isReady = true
                game.stage = "waiting"
            }

            if (!isPlayer1 && game.player2 !== null) {
                game.player2.isReady = true
                game.stage = "waiting"
            }

            if (game.player1?.isReady && game.player2?.isReady) {
                game.startNewGame()
            } else if (game.player1?.isReady || game.player2?.isReady) {
                game.resetGame()
            }

            game.updateGame()
        })
    }

    updateLobby() {
        const lobby = []

        //pull data from games and send it to clients
        for (let i = 1; i < this.games.length; i += 1) {
            lobby[i] = {
                playerSlot1: this.games[i].player1?.playerID || "",
                playerSlot2: this.games[i].player2?.playerID || "",
            }
        }

        console.log(lobby)
        this.server.to("lobby").emit("lobby_updated", lobby)
    }
}
