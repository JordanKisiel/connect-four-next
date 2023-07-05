export const NUM_OF_ROOMS = 3 //keep rooms small for simplicity

const roomsArray = Array(NUM_OF_ROOMS)
for (let i = 0; i < roomsArray.length; i += 1) {
    roomsArray[i] = {
        //initialize all player slots to false when server starts
        isSlot1Filled: false,
        isSlot2Filled: false,
    }
}

export const lobby = {
    rooms: roomsArray,
}

export function getSlotState(roomID, playerSlot) {
    //subtract 1 from roomID because frontend starts counting from 1
    if (playerSlot === "player1") {
        return lobby.rooms[roomID - 1].isSlot1Filled
    } else if (playerSlot === "player2") {
        return lobby.rooms[roomID - 1].isSlot2Filled
    } else {
        throw Error("invalid player slot")
    }
}

export function toggleSlotState(roomID, playerSlot) {
    //subtract 1 from roomID because frontend starts counting from 1
    if (playerSlot === "player1") {
        const newState = !lobby.rooms[roomID - 1].isSlot1Filled
        lobby.rooms[roomID - 1].isSlot1Filled = newState
    } else if (playerSlot === "player2") {
        const newState = !lobby.rooms[roomID - 1].isSlot2Filled
        lobby.rooms[roomID - 1].isSlot2Filled = newState
    } else {
        throw Error("invalid player slot")
    }
}
