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

## Simple example with Module
Download release [here](https://github.com/cuikho210/click-spark-effect/releases/tag/module)

``` js
import SparkEffect from './click-spark-effect.module.js'

const sparkEffect = new SparkEffect({
  color: '#ff90ff',
  length: 30
})

sparkEffect.listen(window)
```

## Simple example with CDN
Download release [here](https://github.com/cuikho210/click-spark-effect/releases/tag/cdn)

``` html
<!DOCTYPE html>
<html>
<head>
    <title>Demo</title>
    <!-- ... -->
    
    <script defer src='https://github.com/cuikho210/click-spark-effect/releases/download/cdn/click-spark-effect.js'></script>
</head>
<body>

    <script>
        const sparkEffect = new SparkEffect({
          color: '#ff90ff',
          length: 30
        })

        sparkEffect.listen(window)
    </script>
</body>
</html>
```

## Example with full config
``` js
import SparkEffect from './click-spark-effect.module.js'

const sparkEffect = new SparkEffect({
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

sparkEffect.listen(document.getElementById('effect-area'))
sparkEffect.listen(document.querySelectorAll('.btn'))
```

## Methods
### **start()**: *void*  
Resume running after pause

### **stop()**: *void*  
Pause effect

### **listen(`element`: `HTMLElement` | `Window` | `NodeList`)**: *boolean*
Listen to the click event
