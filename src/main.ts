import { MainConfig, MousePosition, RGBAColor } from './types'

// Dot
class Dot {
    ctx: CanvasRenderingContext2D
    color: RGBAColor

    dotRadius: number = 1.5
    angle: number = Math.random() * (Math.PI * 2)
    fadeSpeed: number = Math.random() * 0.05 + 0.01

    gravity: number = 0
    gravityAcceleration: number = 0.1

    distance: number = 0
    velocity: number = Math.random() * 4

    rootPosition: MousePosition
    currentPosition: MousePosition = {
        x: 0,
        y: 0
    }

    constructor (ctx: CanvasRenderingContext2D, color: RGBAColor, position: MousePosition) {
        this.ctx = ctx
        this.color = color
        this.rootPosition = position
    }

    private draw () {
        this.ctx.beginPath()

        this.ctx.arc(
            this.rootPosition.x + this.currentPosition.x,
            this.rootPosition.y + this.currentPosition.y,
            this.dotRadius,
            0,
            Math.PI * 2
        )

        // Style
        let color: string = [
            'rgba(',
            this.color.red + ',',
            this.color.green + ',',
            this.color.blue + ',',
            this.color.alpha + ')'
        ].join('')
        
        this.ctx.fillStyle = color
        this.ctx.fill()
        this.ctx.closePath()
    }

    // Return true if finished
    public update (): boolean {
        // Update
        this.updateSpeed()
        this.updateOpacity()
        
        // Draw
        this.draw()

        if (this.color.alpha <= 0) return true
        else return false
    }

    private updateSpeed () {
        this.currentPosition.x = Math.cos(this.angle) * this.distance
        this.currentPosition.y = Math.sin(this.angle) * this.distance

        this.distance += this.velocity

        this.rootPosition.y += this.gravity
        this.gravity += this.gravityAcceleration
    }

    private updateOpacity () {
        if (this.color.alpha <= 0) return
        this.color.alpha -= this.fadeSpeed
    }
}

// Spark
class Spark {
    ctx: CanvasRenderingContext2D
    color: RGBAColor
    mousePosition: MousePosition
    dotsLength: number

    dots: Dot[] = []

    constructor (ctx: CanvasRenderingContext2D, color: RGBAColor, mousePosition: MousePosition, dotsLength: number) {
        this.ctx = ctx
        this.color = color
        this.mousePosition = mousePosition
        this.dotsLength = dotsLength

        this.initDots()
    }

    private initDots () {
        for (let i = 0; i < this.dotsLength; i++) {
            this.dots.push(new Dot(this.ctx, Object.create(this.color), Object.create(this.mousePosition)))
        }
    }

    // Return true if finished animation
    public update (): boolean {
        this.dots.forEach((dot: Dot, index: number) => {
            if (dot.update()) {
                delete this.dots[index]
                this.dots.splice(index, 1)
            }
        })

        if (this.dots.length === 0) return true
        return false
    }
}

// Main
class Main {
    private color: RGBAColor = {
        red: 255,
        green: 144,
        blue: 127,
        alpha: 1
    }

    private canvas: HTMLCanvasElement = document.createElement('canvas')
    private ctx: CanvasRenderingContext2D | null = this.canvas.getContext('2d')

    private sparks: Spark[] = []
    private dotsPerSpark: number = 20

    private isStop: boolean = true

    constructor (config: MainConfig) {
        if (config) {
            if (config.length) this.dotsPerSpark = config.length
            if (config.color) this.color = this.stringToRGBAColorObject(config.color)
        }

        this.createCanvas()
        this.handleEvents()
        this.start()
    }

    private createCanvas () {
        this.canvas.style.position = 'absolute'
        this.canvas.style.top = '0'
        this.canvas.style.left = '0'
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        this.canvas.style.pointerEvents = 'none'
        
        this.resizeCanvas()

        document.body.appendChild(this.canvas)
    }

    private resizeCanvas () {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    private clearCanvas () {
        if (this.ctx === null) return

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    private updateCanvas () {
        if (this.ctx === null) return

        this.sparks.forEach((spark: Spark, index: number) => {
            if (spark.update()) {
                delete this.sparks[index]
                this.sparks.splice(index, 1)
            }
        })
    }

    private loopCanvas () {
        if (this.isStop) return

        this.clearCanvas()
        this.updateCanvas()

        requestAnimationFrame(() => this.loopCanvas())
    }

    private handleEvents () {
        window.addEventListener('resize', () => this.resizeCanvas())

        window.addEventListener('click', (event: MouseEvent) => {
            if (this.ctx === null) return
            
            this.sparks.push(new Spark(this.ctx, this.color, this.getMousePosition(event), this.dotsPerSpark))
        })
    }

    private getMousePosition (event: MouseEvent): MousePosition {
        let rect: HTMLCanvasElement = this.canvas

        let x: number = event.clientX - rect.getBoundingClientRect().x
        let y: number = event.clientY - rect.getBoundingClientRect().y

        return {x, y}
    }

    private stringToRGBAColorObject (color: string): RGBAColor {
        let rgbaColor: RGBAColor = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0
        }

        // If is a RGB color
        if (color.search('rgb') !== -1) {
            let arr: string[] = color.replace('rgb(', '').replace(')', '').split(',')
            
            return {
                red: Number(arr[0]),
                green: Number(arr[1]),
                blue: Number(arr[2]),
                alpha: 1
            }
        }
        // If is a Hex color
        else if (color.search('#') !== -1) {
            let red: number = parseInt(color.slice(1, 3), 16)
            let green: number = parseInt(color.slice(3, 5), 16)
            let blue: number = parseInt(color.slice(5, 7), 16)
            
            return {
                red,
                green,
                blue,
                alpha: 1
            }
        }

        return rgbaColor
    }

    public start () {
        this.isStop = false
        this.loopCanvas()
    }

    public stop () {
        this.isStop = true
    }
}

export default Main