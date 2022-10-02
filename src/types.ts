export interface MainConfig {
    color: string | null
    length: number | null
    element: HTMLElement | null
    dotConfig: DotConfig | null
}

export interface DotConfig {
    dotRadius: number
    gravity: number
    fadeSpeed: (() => number)
    velocity: (() => number)
    angle: (() => number)
}

export interface MousePosition {
    x: number
    y: number
}

export interface RGBAColor {
    red: number
    green: number
    blue: number
    alpha: number
}