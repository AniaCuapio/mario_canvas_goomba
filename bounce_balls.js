var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var vel = 5;

//ctx.fillRect(0,0,300,200);

function Circle(color, radius, x, y, velo) {
    this.x = x ? x : 50;
    this.y = y ? y : 50;
    this.radius = radius ? radius : 20;
    this.color = color ? color : "red";
    this.isMoving = true;
    this.toUp = false;
    this.toLeft = false;

    this.getDistance = function (circle) {
        var xD = this.x - circle.x;
        var yD = this.y - circle.y;
        return Math.sqrt(Math.pow(xD, 2) + Math.pow(yD, 2));


    }

    this.isTouching = function (circle) {
        return this.getDistance(circle) < this.radius + circle.radius;
    }

    this.move = function () {
        if (!this.isMoving) return;
        var rX = this.x + this.radius;
        var rY = this.y + this.radius;
        //arriba y abajo
        if (this.toUp) {
            this.y -= velo ? velo : vel;
        } else {
            this.y += velo ? velo : vel;
        }
        //izq derecha
        if (this.toLeft) {
            this.x -= velo ? velo : vel;
        } else {
            this.x += velo ? velo : vel;
        }

        //techo y pis
        if (rY > canvas.height) {
            this.toUp = true;
        } else if (rY < 0 + this.radius * 2) {
            this.toUp = false;
        }
        //paredes
        if (rX > canvas.width) {
            this.toLeft = true;
        } else if (rX < 0 + this.radius * 2) {
            this.toLeft = false;
        }
    }

    this.draw = function () {
        this.move();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

    }
}

var circle1 = new Circle();
var circle2 = new Circle("green", 30, 100, 100, 4);
circle1.draw();
circle2.draw();


addEventListener('mousemove', function (e) {
    console.log(e)
    circle2.x = e.clientX;
    circle2.y = e.clientY;
});

var interval;

interval = setInterval(function () {
    ctx.clearRect(0, 0, 300, 200);
    circle1.draw();
    circle2.draw();

    if (circle1.isTouching(circle2)) {
        circle2.color = "peru";
        circle2.toUp = !circle2.toUp
        //circle2.toLeft = !circle2.toLeft
        circle1.toUp = !circle1.toUp
        circle1.toLeft = !circle1.toLeft
    } else {
        circle2.color = "green";
    }
}, 1000 / 60);