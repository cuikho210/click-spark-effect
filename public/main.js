// Dot
var Dot = /** @class */ (function () {
    function Dot(ctx, color, position, config) {
        this.gravity = 0;
        this.distance = 0;
        this.currentPosition = {
            x: 0,
            y: 0
        };
        this.ctx = ctx;
        this.color = color;
        this.rootPosition = position;
        this.dotRadius = config.dotRadius;
        this.gravityAcceleration = config.gravity;
        this.fadeSpeed = config.fadeSpeed();
        this.velocity = config.velocity();
        this.angle = config.angle();
    }
    Dot.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.arc(this.rootPosition.x + this.currentPosition.x, this.rootPosition.y + this.currentPosition.y, this.dotRadius, 0, Math.PI * 2);
        // Style
        var color = [
            'rgba(',
            this.color.red + ',',
            this.color.green + ',',
            this.color.blue + ',',
            this.color.alpha + ')'
        ].join('');
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    };
    // Return true if finished
    Dot.prototype.update = function () {
        // Update
        this.updateSpeed();
        this.updateOpacity();
        // Draw
        this.draw();
        if (this.color.alpha <= 0)
            return true;
        else
            return false;
    };
    Dot.prototype.updateSpeed = function () {
        this.currentPosition.x = Math.cos(this.angle) * this.distance;
        this.currentPosition.y = Math.sin(this.angle) * this.distance;
        this.distance += this.velocity;
        this.rootPosition.y += this.gravity;
        this.gravity += this.gravityAcceleration;
    };
    Dot.prototype.updateOpacity = function () {
        if (this.color.alpha <= 0)
            return;
        this.color.alpha -= this.fadeSpeed;
    };
    return Dot;
}());
// Spark
var Spark = /** @class */ (function () {
    function Spark(ctx, color, mousePosition, dotsLength, dotConfig) {
        this.dotConfig = {
            dotRadius: 1.5,
            gravity: 0.2,
            velocity: function () { return Math.random() * 3 + 1; },
            fadeSpeed: function () { return Math.random() * 0.06 + 0.02; },
            angle: function () { return Math.random() * Math.PI * 2; }
        };
        this.dots = [];
        this.ctx = ctx;
        this.color = color;
        this.mousePosition = mousePosition;
        this.dotsLength = dotsLength;
        if (dotConfig) {
            if (dotConfig.dotRadius)
                this.dotConfig.dotRadius = dotConfig.dotRadius;
            if (dotConfig.gravity)
                this.dotConfig.gravity = dotConfig.gravity;
            if (dotConfig.fadeSpeed)
                this.dotConfig.fadeSpeed = dotConfig.fadeSpeed;
            if (dotConfig.velocity)
                this.dotConfig.velocity = dotConfig.velocity;
            if (dotConfig.angle)
                this.dotConfig.angle = dotConfig.angle;
        }
        this.initDots();
    }
    Spark.prototype.initDots = function () {
        for (var i = 0; i < this.dotsLength; i++) {
            this.dots.push(new Dot(this.ctx, Object.create(this.color), Object.create(this.mousePosition), this.dotConfig));
        }
    };
    // Return true if finished animation
    Spark.prototype.update = function () {
        var _this = this;
        this.dots.forEach(function (dot, index) {
            if (dot.update()) {
                delete _this.dots[index];
                _this.dots.splice(index, 1);
            }
        });
        if (this.dots.length === 0)
            return true;
        return false;
    };
    return Spark;
}());
// Main
var Main = /** @class */ (function () {
    function Main(config) {
        this.color = {
            red: 255,
            green: 144,
            blue: 127,
            alpha: 1
        };
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.parentElement = document.body;
        this.sparks = [];
        this.dotsPerSpark = 50;
        this.dotConfig = null;
        this.isStop = true;
        if (config) {
            if (config.length)
                this.dotsPerSpark = config.length;
            if (config.color)
                this.color = this.stringToRGBAColorObject(config.color);
            if (config.element)
                this.parentElement = config.element;
            if (config.dotConfig)
                this.dotConfig = config.dotConfig;
        }
        this.createCanvas();
        this.handleEvents();
        this.start();
    }
    Main.prototype.createCanvas = function () {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '99999';
        this.canvas.style.pointerEvents = 'none';
        this.resizeCanvas();
        this.parentElement.appendChild(this.canvas);
    };
    Main.prototype.resizeCanvas = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Main.prototype.clearCanvas = function () {
        if (this.ctx === null)
            return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Main.prototype.updateCanvas = function () {
        var _this = this;
        if (this.ctx === null)
            return;
        this.sparks.forEach(function (spark, index) {
            if (spark.update()) {
                delete _this.sparks[index];
                _this.sparks.splice(index, 1);
            }
        });
    };
    Main.prototype.loopCanvas = function () {
        var _this = this;
        if (this.isStop)
            return;
        this.clearCanvas();
        this.updateCanvas();
        requestAnimationFrame(function () { return _this.loopCanvas(); });
    };
    Main.prototype.handleEvents = function () {
        var _this = this;
        window.addEventListener('resize', function () { return _this.resizeCanvas(); });
        window.addEventListener('click', function (event) {
            if (_this.ctx === null)
                return;
            _this.sparks.push(new Spark(_this.ctx, _this.color, _this.getMousePosition(event), _this.dotsPerSpark, _this.dotConfig));
        });
    };
    Main.prototype.getMousePosition = function (event) {
        var rect = this.canvas;
        var x = event.clientX - rect.getBoundingClientRect().x;
        var y = event.clientY - rect.getBoundingClientRect().y;
        return { x: x, y: y };
    };
    Main.prototype.stringToRGBAColorObject = function (color) {
        var rgbaColor = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0
        };
        // If is a RGB color
        if (color.search('rgb') !== -1) {
            var arr = color.replace('rgb(', '').replace(')', '').split(',');
            return {
                red: Number(arr[0]),
                green: Number(arr[1]),
                blue: Number(arr[2]),
                alpha: 1
            };
        }
        // If is a Hex color
        else if (color.search('#') !== -1) {
            var red = parseInt(color.slice(1, 3), 16);
            var green = parseInt(color.slice(3, 5), 16);
            var blue = parseInt(color.slice(5, 7), 16);
            return {
                red: red,
                green: green,
                blue: blue,
                alpha: 1
            };
        }
        return rgbaColor;
    };
    Main.prototype.start = function () {
        this.isStop = false;
        this.loopCanvas();
    };
    Main.prototype.stop = function () {
        this.isStop = true;
    };
    return Main;
}());
export default Main;
