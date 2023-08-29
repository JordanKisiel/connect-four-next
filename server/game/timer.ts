export class Timer {
    startTime: number
    remainingTime: number
    callbackFunction: Function
    interval: NodeJS.Timeout | undefined

    constructor(startTime: number, callbackFunction: Function) {
        this.startTime = startTime
        this.remainingTime = startTime
        this.callbackFunction = callbackFunction
        this.interval = undefined
    }

    start() {
        this.reset()
        this.interval = setInterval(() => {
            if (this.remainingTime > 0) {
                console.log(`Remaining time: ${this.remainingTime}`)
                this.remainingTime -= 1
            } else {
                this.callbackFunction()
                clearInterval(this.interval)
            }
        }, 1000)
    }

    reset() {
        clearInterval(this.interval)
        this.remainingTime = this.startTime
    }
}
