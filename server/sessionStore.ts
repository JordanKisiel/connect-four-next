//abstract
class SessionStore {
    findSession(id: string) {}
    saveSession(id: string, session: { connected: boolean }) {}
    findAllSessions() {}
}

export class InMemorySessionStore extends SessionStore {
    sessions: Map<string, {}>

    constructor() {
        super()
        this.sessions = new Map()
    }

    findSession(id: string) {
        return this.sessions.get(id)
    }

    saveSession(id: string, session: { connected: boolean }) {
        this.sessions.set(id, session)
    }

    findAllSessions() {
        return [...this.sessions.values()]
    }
}
