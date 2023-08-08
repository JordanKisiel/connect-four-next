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

        socket.on("cancelled_rejoin", ({ gameID, playerID }) => {
            this.cancelRejoin(gameID, playerID)
        })

        this.attemptRejoin(socket)
    }

    //search through games for player and, if found,
    //allow player the option to rejoin if they were disconnected
    //and the game is still in progress
    attemptRejoin(socket: Socket) {
        for (let i = 1; i < this.games.length; i += 1) {
            const clientID = socket.handshake.auth.id
            const game = this.games[i]
            if (clientID === game.player1?.playerID) {
                const foundGameID = game.roomID.charAt(game.roomID.length - 1)
                game.addPlayer(new Player(socket, true, true))
                socket.emit("player_rejoining", { gameID: foundGameID })
            }

            if (clientID === game.player2?.playerID) {
                const foundGameID = game.roomID.charAt(game.roomID.length - 1)
                game.addPlayer(new Player(socket, false, true))
                socket.emit("player_rejoining", { gameID: foundGameID })
            }
        }
    }

    cancelRejoin(gameID: string, playerID: string) {
        const game = this.games[Number(gameID)]

        if (playerID === game.player1?.playerID) {
            if (game.player1) game.removePlayer(game.player1)
        }
        if (playerID === game.player2?.playerID) {
            if (game.player2) game.removePlayer(game.player2)
        }

        game.stage = "over"
        game.updateGame()
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
