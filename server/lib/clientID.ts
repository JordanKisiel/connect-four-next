import { v4 as uuidv4 } from "uuid"

const CLIENT_ID_KEY = "connect-four-next-id"

export function getClientID(): string | null{
    //get client id or generate it for the first time
    let id = localStorage.getItem(CLIENT_ID_KEY)

    if (id === null) {
        localStorage.setItem(CLIENT_ID_KEY, uuidv4())
        id = localStorage.getItem(CLIENT_ID_KEY)
    }

    return id
}


