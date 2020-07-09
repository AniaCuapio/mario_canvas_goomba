// Config
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
//ctx.fillRect(0,0,canvas.width,canvas.height)

// Globals
let sounds = {
    gameOver: "https://vgmdownloads.com/soundtracks/new-super-mario-bros.-2/juygtzsr/1-41%20Game%20Over.mp3",
    music: "https://vgmdownloads.com/soundtracks/new-super-mario-bros.-2/zsujimsl/1-5%20Bonus%20Room.mp3"
}
let images = {
    mario: "https://miro.medium.com/max/420/0*UnsiT5rG5W41Ymxt",
    bg: "https://bit.ly/2LA87TH",
    goomba: "https://miro.medium.com/max/100/0*hecYvvrb0V0xXxkm.png"
}
let interval // si queremos apagar
let frames = 0 // siempre queremos contar
let enemies = []
let gameOver = new Audio()
gameOver.src = sounds.gameOver
let music = new Audio()
music.src = sounds.music

// Clases
class GameItem {
    constructor(config) {
        this.x = config.x ? config.x : 0
        this.y = config.y ? config.y : 0
        this.width = config.width ? config.width : 60
        this.height = config.height ? config.height : 60
        this.img = new Image()
        this.img.src = config.image ? config.image : null
        this.img.onload = this.draw
    }

    draw = () => {

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

}

class Mario extends GameItem {
    constructor(config) {
        super(config) // papi dame mi herencia diunavez tengo una idea de negocio muy buena
    }
    moveLeft = () => {
        this.x -= 56
        if (this.x < 0) this.x = 0
    }

    moveRight = () => {
        this.x += 56
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width
    }


    crashWith = (item) => { // false o un true ....
        return (this.x < item.x + item.width) &&
            (this.x + this.width > item.x) &&
            (this.y < item.y + item.height) &&
            (this.y + this.height > item.y);
    }


}

class Goomba extends GameItem {
    constructor(config) {
        super(config)
        this.vy = config.vy ? config.vy : 1
    }

    //     this.move = function () {
    //     if (!this.isMoving) return;
    //     var rX = this.x + this.radius;
    //     var rY = this.y + this.radius;
    //     //arriba y abajo
    //     if (this.toUp) {
    //         this.y -= velo ? velo : vel;
    //     } else {
    //         this.y += velo ? velo : vel;
    //     }
    //     //izq derecha
    //     if (this.toLeft) {
    //         this.x -= velo ? velo : vel;
    //     } else {
    //         this.x += velo ? velo : vel;
    //     }

    //     //techo y pis
    //     if (rY > canvas.height) {
    //         this.toUp = true;
    //     } else if (rY < 0 + this.radius * 2) {
    //         this.toUp = false;
    //     }
    //     //paredes
    //     if (rX > canvas.width) {
    //         this.toLeft = true;
    //     } else if (rX < 0 + this.radius * 2) {
    //         this.toLeft = false;
    //     }
    // }

    draw = () => { // sobreescrim¡bimos el draw original
        this.y += this.vy // <<================================================= WTF tengo 30 min explicandolo!!
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

// Instancias
let backg = new GameItem({ height: canvas.height, width: canvas.width, image: images.bg })
let mario = new Mario({ x: 0, y: 450, image: images.mario })
// si tengo 200 goombas ? o llego 10,000 ?? ---> Array!
// enemies.push(new Goomba({x:100,y:20,image:images.goomba})) // <<--- esto se puede repetir y no necesitamos recordar los nombres

// Main functions
function start() {
    music.play()
    interval = setInterval(update, 1000 / 60)
}

function update() { // esta mierda se repite infinitamente
    // también contamo
    frames++
    console.log(frames)
    // aquí dibujamo
    // antes borramo
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // redibujamo cada uno de los elementos del videjuego (instancias) <-- regla
    backg.draw()
    mario.draw()
    // si lo quiero en mi videojuego lo tengo que meter a update
    drawGoombas()
    // generate stuff:
    if (frames % 100 === 0) generateGoomba() // cual es el tiempo optimo para que no se encimen ...
    checkCollition()
    // score
    drawScore()
}

function stop() {
    music.pause()
    clearInterval(interval)
    ctx.font = "50px 'Press Start 2P'"
    ctx.fillStyle = "white"
    ctx.fillText("Game Over", 50, 200)
    ctx.font = "15px 'Press Start 2P'"
    ctx.fillText("Press space btn to restart", 100, 300)
    gameOver.play()
}

// aux functions
// <3 de tu juego
function generateGoomba() {
    // queremos: enemies.push(new Goomba({x:100,y:20,image:images.goomba}))
    let x = Math.floor((Math.random() * (canvas.width - 5)) + 5)
    //generate random vy
    let goomba = new Goomba({ x, image: images.goomba, vy: 2 })
    enemies.push(goomba)
}

function drawGoombas() {  // ya podemos dibujarlos a todos
    enemies.forEach(goomba => { // porque es un ciclo 
        goomba.draw()
    })
}

function checkCollition() {
    enemies.forEach(goomba => {
        if (mario.crashWith(goomba)) {
            stop() // function aux restarle la vida y provar un brillo
        }
    })
}

function drawScore() {
    let sec = Math.floor(frames / 60)
    ctx.fillStyle = "white"
    ctx.font = "20px 'Press Start 2P'"
    ctx.fillText(sec, 450, 40)
}

// listeners
addEventListener('keydown', e => {
    if (e.keyCode === 37) mario.moveLeft() // esto es un atributo publico
    if (e.keyCode === 39) mario.moveRight() // deberíamos usar setters y getters...
    if (e.key === "Enter") start()
})

// start()


// 1.- Pantalla de bienvenida
// 2.- espacio para reset
// 3.- agregar, | velocidad si pasan 10 seg | Agregarle vidas a mario | Estrellitas (con efecto)
// | Cuando se tocan las * mario es: (inmune|aumenta vida| se cambia por luigi | se mueren  los goombas)
// | Mario dipara << tan complejo como quieras |