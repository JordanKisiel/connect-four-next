export class Timer {
    startTime: number
    remainingTime: number

    constructor(startTime: number) {
        this.startTime = startTime
        this.remainingTime = startTime
    }

    start(callbackFunction: Function) {
        const interval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime -= 1
            } else {
                callbackFunction()
                clearInterval(interval)
            }
        }, 1000)
    }

    reset() {
        this.remainingTime = this.startTime
    }
}
