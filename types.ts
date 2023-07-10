//board is represented by a 2D array
//possible values are:
//-true for the discs of the first player
//-false for the discs of the second player
//-null for empty spaces
export type Board = (boolean | null)[][]

//allowable difficulty settings
export type Difficulty = "easy" | "medium" | "hard"

export type Lobby = {
    rooms: {
        playerSlot1: string
        playerSlot2: string
    }[]
}
