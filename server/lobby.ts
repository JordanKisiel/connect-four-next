import { Game } from "./game.ts"
import { Server, Socket } from "socket.io"

type SessionSocket = Socket & { sessionID: string }

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
        for (let i = 1; i < numRooms + 1; i += 1) {
            const roomID = `Room ${i}`
            const game = new Game(roomID, server)
            this.games.push(game)
        }
    }

    //adds a new connection to the lobby for managment
    //note: being in the lobby doesn't mean that the user
    //has selected a player slot
    addUser(socket: SessionSocket) {
        //register lobby events
        socket.on("start_lobby", () => {
            socket.join("lobby")
            this.updateLobby()
        })

        socket.on("leave_lobby", () => {
            socket.leave("lobby")
        })

        //whenever a client selects a player slot on the client
        //the server updates the lobby state and sends it back to the client
        socket.on("select_slot", ({ roomID, playerSlot }) => {
            //when slot is selected, a user should be added to the corresponding game
            //and removed from any other game

            //remove player from any other games
            const otherGames = this.games.filter((game) => {
                return game.roomID !== roomID
            })

            for (let game of otherGames) {
                game.removePlayer(socket)
            }

            //add player to selected game and slot
            const selectedGame = this.games.filter((game) => {
                return game.roomID === roomID
            })

            const isPlayer1 = playerSlot === "player1"
            selectedGame[0].addPlayer(socket, isPlayer1)

            this.updateLobby()
        })
    }

    updateLobby() {
        const lobby = []

        for (let game of this.games) {
            lobby.push({
                player1Slot: game.player1,
                player2Slot: game.player2,
            })
        }

        this.server.to("lobby").emit("lobby_updated", lobby)
        console.log(lobby)
    }
}
