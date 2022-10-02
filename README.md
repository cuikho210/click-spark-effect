# click-spark-effect
Hiệu ứng tia lửa mỗi khi bạn click chuột ^^

[[Release]](https://github.com/cuikho210/click-spark-effect/releases/tag/module)  
[[Demo]](https://cuikho210.github.io/click-spark-effect/public)

## Config
``` js
{
    color: string // Color of the dot
    length: number // Number of dots per click
    element: HTMLElement // Element containing canvas
    
    dotConfig: {
        dotRadius: number // Size of the dot
        gravity: number // Gravity acceleration
        fadeSpeed: (() => number) // Dot's disappearance speed
        velocity: (() => number) // The speed of the dot
        angle: (() => number) // A random direction
    }
}
```

## Simple Example
Download release [here](https://github.com/cuikho210/click-spark-effect/releases/tag/module)

``` js
import SparkEffect from './click-spark-effect.module.js'

new SparkEffect({
  color: '#ff90ff',
  length: 30
})
```
## Example with full config
``` js
new SparkEffect({
    element: document.getElementById('effect'),
    color: '#ffccff',
    length: 50,

    dotConfig: {
        dotRadius: 1.5,
        gravity: 0.2,
        velocity: () => Math.random() * 3 + 1,
        fadeSpeed: () => Math.random() * 0.06 + 0.02,
        angle: () => Math.random() * Math.PI * 2
    }
})
```

## Methods
### **start()**: *void*  
Resume running after pause

### **stop()**: *void*  
Pause effect
