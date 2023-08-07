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
        this.interval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime -= 1
            } else {
                this.callbackFunction()
                clearInterval(this.interval)
            }
        }, 1000)
    }

    reset() {
        this.remainingTime = this.startTime
        clearInterval(this.interval)
        this.start()
    }
}
