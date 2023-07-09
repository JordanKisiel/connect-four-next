export const NUM_OF_ROOMS = 3 //keep rooms small for simplicity

const roomsArray = Array(NUM_OF_ROOMS)
for (let i = 0; i < roomsArray.length; i += 1) {
    roomsArray[i] = {
        //initialize all player slots to false when server starts
        playerSlot1: "",
        playerSlot2: "",
    }
}

export const lobby = {
    rooms: roomsArray,
}

//look for playerID in lobby and return
//roomID & playerSlot
//if playerID not found, roomID & playerSlot will return
//with empty string values
export function findPlayer(playerID) {
    for (let [index, room] of lobby.rooms.entries()) {
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
export function fillPlayerSlot(roomID, playerSlot, playerID) {
    const currentLocation = findPlayer(playerID)

    console.log(currentLocation)

    if (playerSlot === "player1") {
        //subtract 1 from roomID because frontend starts counting from 1
        lobby.rooms[roomID - 1].playerSlot1 = playerID
    } else if (playerSlot === "player2") {
        lobby.rooms[roomID - 1].playerSlot2 = playerID
    } else {
        throw Error("invalid player slot")
    }

    if (currentLocation.roomID !== "" && currentLocation.playerSlot !== "") {
        console.log("clearing previous")
        lobby.rooms[currentLocation.roomID][currentLocation.playerSlot] = ""
    }
}

function emptyPlayerSlot(roomID, playerSlot) {
    if (playerSlot === "player1") {
        //subtract 1 from roomID because frontend starts counting from 1
        lobby.rooms[roomID - 1].playerSlot1 = ""
    } else if (playerSlot === "player2") {
        lobby.rooms[roomID - 1].playerSlot2 = ""
    } else {
        throw Error("invalid player slot")
    }
}

export function removePlayer(playerID) {
    for (let [index, room] of lobby.rooms.entries()) {
        if (room.playerSlot1 === playerID) {
            lobby.rooms[index].playerSlot1 = ""
        }
        if (room.playerSlot2 === playerID) {
            lobby.rooms[index].playerSlot2 = ""
        }
    }
}
