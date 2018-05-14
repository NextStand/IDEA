export default class cleCanvas {
    constructor(opt) {
        this.init(opt);
    }
    init(opt) {
        this._initDom(opt);
        this.canvas.width = this.options.canvasWidth;
        this.canvas.height = this.options.canvasHeight;
        this._initCir(this.context);
        this.render();
    }
    _initDom(opt) {
        this.options = {
            canvasContainerID: "canvas-container",  //运用背景的盒子的ID名
            canvasOpacity: 0.8,                     //canvas背景的透明度，默认为0.8
            circleNum: 40,                          //页面中随机产生的圆点的数量，默认为40
            circleColor: "rgba(180,180,180,1)",     //页面的颜色，可接受rgb、rgba、十六进制、关键字形式，默认为rgba(180,180,180,1)
            lineColor: "rgba(180,180,180,1)",       //线条的颜色，只接受rgba形式，默认为rgba(180,180,180,1)
            circleMovemaxX: 2,                      //圆点每次X轴移动最大的距离，整数为向右移动，负数为向左移动，默认为2
            circleMoveminX: -2,                     //圆点每次X轴移动最小的距离，整数为向右移动，负数为向左移动，默认为-2
            circleMovemaxY: 2,                      //圆点每次Y轴移动最大的距离，整数为向下移动，负数为向上移动，默认为2
            circleMoveminY: -2,                     //圆点每次Y轴移动最小的距离，整数为向下移动，负数为向上移动，默认为-2
            canvasWidth: document.documentElement.clientWidth || document.body.Width,//canvas背景的宽度，默认为整个窗口可视区宽度
            canvasHeight: document.documentElement.clientHeight || document.body.client//canvas背景的高度，默认为整个窗口可视区高度
        }
        if (opt) {
            for (var key in opt) {
                this.options[key] = opt[key];
            }
        }
        var canvasEle = document.createElement("canvas");
        var canvasContainer = document.getElementById(this.options.canvasContainerID);
        canvasContainer.appendChild(canvasEle);
        canvasEle.style.cssText = "z-index:-20;position:absolute;left:0;top:0";
        canvasEle.style.opacity = this.options.canvasOpacity;
        this.canvas = canvasEle;
        this.drawMaxWidth = this.options.canvasWidth + 30;
        this.drawMinWidth = -30;
        this.drawMaxHeight = this.options.canvasHeight + 30;
        this.drawMinHeight = -30;
        this.context = this.canvas.getContext("2d");
        this.circleArr = [];
        this.moveArr = [];
    }
    random(max, _min) {
        var minNum = arguments[1] || 0;
        return Math.floor(Math.random() * (max - minNum + 1) + minNum);
    }
    _initCir(context) {
        var self = this;
        for (var i = 0; i < self.options.circleNum; i++) {
            var x = self.random(self.drawMaxWidth, self.drawMinWidth);
            var y = self.random(self.drawMaxHeight, self.drawMinHeight);
            var r = self.random(10);
            var newCircle = self.drawCircle(context, x, y, r);
            self.circleArr.push(newCircle);
            var move = {
                x: Math.random() * (self.options.circleMovemaxX - self.options.circleMoveminX) + self.options.circleMoveminX,
                y: Math.random() * (self.options.circleMovemaxY - self.options.circleMoveminY) + self.options.circleMoveminY
            }
            self.moveArr.push(move);
        }
    }
    _initLine(ctx, bx, by, cx, cy, opacity) {
        var self = this;
        function Line(bx, by, cx, cy) {
            this.beginX = bx;
            this.beginY = by;
            this.closeX = cx;
            this.closeY = cy;
        }
        var line = new Line(bx, by, cx, cy);
        ctx.beginPath();
        ctx.moveTo(line.beginX, line.beginY);
        ctx.lineTo(line.closeX, line.closeY);
        ctx.stroke();
        var colorArr = self.options.lineColor.split(",");
        ctx.strokeStyle = colorArr[0] + "," + colorArr[1] + "," + colorArr[2] + "," + opacity + ")";
        ctx.closePath();
    }
    render() {
        var self = this;
        self.context.clearRect(0, 0, self.options.canvasWidth, self.options.canvasHeight);
        for (var i = 0; i < 40; i++) {
            var changeCircle = self.circleArr[i];
            changeCircle.centerX += self.moveArr[i].x;
            changeCircle.centerY += self.moveArr[i].y;
            self.drawCircle(self.context, changeCircle.centerX, changeCircle.centerY, changeCircle.radius);
            if (changeCircle.centerX < self.drawMinWidth) {
                changeCircle.centerX = self.drawMaxWidth;
                changeCircle.centerY = self.random(self.drawMaxHeight, self.drawMinHeight);
            } else if (changeCircle.centerX > self.drawMaxWidth) {
                changeCircle.centerX = self.drawMinWidth;
                changeCircle.centerY = self.random(self.drawMaxHeight, self.drawMinHeight);
            } else if (changeCircle.centerY < self.drawMinHeight) {
                changeCircle.centerY = self.random(self.drawMaxWidth, self.drawMinWidth);
                changeCircle.centerY = self.drawMaxHeight;
            } else if (changeCircle.centerY > self.drawMaxHeight) {
                changeCircle.centerY = self.random(self.drawMaxWidth, self.drawMinWidth);
                changeCircle.centerY = self.drawMinWidth;
            }

        }
        for (var j = 0; j < 40; j++) {
            for (var k = 0; k < 40; k++) {
                var bx = self.circleArr[j].centerX;
                var by = self.circleArr[j].centerY;
                var cx = self.circleArr[k].centerX;
                var cy = self.circleArr[k].centerY;
                var dis = Math.sqrt(Math.abs(cx - bx) * Math.abs(cx - bx) + Math.abs(by - cy) * Math.abs(by - cy));
                if (dis < 0.3 * this.options.canvasWidth || dis > this.options.canvasWidth * 1.2) {
                    var lineOpacity = 1;
                    lineOpacity = lineOpacity > 0.3 ? 0.3 : lineOpacity;
                    self._initLine(self.context, bx, by, cx, cy, lineOpacity);
                }
            }
        }
        var timer = setTimeout(function () {
            self.render();
        }, 30);
    }
    drawCircle(ctx, x, y, r) {
        var self = this;
        function Circle(x, y, r) {
            this.centerX = x;
            this.centerY = y;
            this.radius = r;
        }
        var circle = new Circle(x, y, r);
        ctx.beginPath();
        ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = self.options.circleColor;
        ctx.fill();
        ctx.closePath();
        return circle;
    }
}