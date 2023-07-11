export class Lobby {
    constructor(numRooms, server) {
        this.numRooms = numRooms
        this.server = server

        const roomsArray = Array(numRooms).fill("")

        this.rooms = roomsArray.map((room) => {
            return {
                playerSlot1: "",
                playerSlot2: "",
            }
        })
    }

    //adds a new connection to the lobby for managment
    //note: being in the lobby doesn't mean that the user
    //has selected a player slot
    addUser(socket) {
        //register lobby events
        socket.on("start_lobby", () => {
            socket.join("lobby")
            this.update()
        })

        socket.on("leave_lobby", () => {
            this.removePlayer(socket.sessionID)
            socket.leave("lobby")
        })

        //whenever a client selects a player slot on the client
        //the server updates the lobby state and sends it back to the client
        socket.on("select_slot", (data) => {
            //remove player from current room if they're in one
            const { roomID, playerSlot } = this.findPlayer(socket.sessionID)
            if (roomID !== "" && playerSlot !== "") {
                socket.leave(`Room ${roomID + 1}`)
            }

            this.fillPlayerSlot(data.roomID, data.playerSlot, socket.sessionID)
            socket.join(`Room ${data.roomID}`)
        })
    }

    //look for playerID in lobby and returns
    //roomID & playerSlot
    //if playerID not found, roomID & playerSlot will return
    //with empty string values
    findPlayer(playerID) {
        for (let [index, room] of this.rooms.entries()) {
            if (room.playerSlot1 === playerID) {
                return {
                    roomID: index,
                    playerSlot: "playerSlot1",
                }
            }
            if (room.playerSlot2 === playerID) {
                return {
                    roomID: index,
                    playerSlot: "playerSlot2",
                }
            }
        }

        return {
            roomID: "",
            playerSlot: "",
        }
    }

    //fills selected slot with playerID
    //if playerID was already present in a slot
    //empty out that slot
    fillPlayerSlot(roomID, playerSlot, playerID) {
        const currentLocation = this.findPlayer(playerID)
        console.log(currentLocation)

        if (playerSlot === "player1") {
            //subtract 1 from roomID because frontend starts counting from 1
            this.rooms[roomID - 1].playerSlot1 = playerID
        } else if (playerSlot === "player2") {
            this.rooms[roomID - 1].playerSlot2 = playerID
        } else {
            throw Error("invalid player slot")
        }

        if (
            currentLocation.roomID !== "" &&
            currentLocation.playerSlot !== ""
        ) {
            console.log(`emptying player slot for user: ${playerID}`)
            this.rooms[currentLocation.roomID][currentLocation.playerSlot] = ""
        }

        this.update()

        console.log(this.rooms)
    }

    emptyPlayerSlot(roomID, playerSlot) {
        if (playerSlot === "player1") {
            //subtract 1 from roomID because frontend starts counting from 1
            this.rooms[roomID - 1].playerSlot1 = ""
        } else if (playerSlot === "player2") {
            this.rooms[roomID - 1].playerSlot2 = ""
        } else {
            throw Error("invalid player slot")
        }
    }

    removePlayer(playerID) {
        for (let [index, room] of this.rooms.entries()) {
            if (room.playerSlot1 === playerID) {
                this.rooms[index].playerSlot1 = ""
            }
            if (room.playerSlot2 === playerID) {
                this.rooms[index].playerSlot2 = ""
            }
        }

        this.update()
    }

    update() {
        this.server.to("lobby").emit("lobby_updated", this.rooms)
        console.log(this.rooms)
    }
}
