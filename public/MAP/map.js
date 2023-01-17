const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576 

const collisionsMap = []
for (let i = 0; i < collisions.length; i+=40){
    collisionsMap.push(collisions.slice(i, 40 + i))
}

class Boundary {
    static width = 44.80
    static height = 44.80
    constructor ({position}) {
        this.position = position
        this.width = 44.80
        this.height = 44.80
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = {
    x: 60,
    y: -2130
}
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 3690)
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }}
            )
        )
    })
})

c.fillStyle = "White"
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = 'Map Out Inside Cave.png'

const playerImage = new Image()
playerImage.src = '../PLAYER/Player_walk_down.png'

class Sprite {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
} 

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(Boundary => {
        Boundary.draw()
    })
    c.drawImage(playerImage, 
        0,
        0,
        playerImage.width / 4,
        playerImage.height,
        canvas.width / 2 - (playerImage.width / 4) / 2, 
        canvas.height / 2 - playerImage.height / 2,
        playerImage.width / 4,
        playerImage.height,
    )
    if (keys.w.pressed && lastKey === 'w') background.position.y +=2
    else if (keys.a.pressed && lastKey === 'a') background.position.x += 2
    else if (keys.s.pressed && lastKey === 's') background.position.y -= 2
    else if (keys.d.pressed && lastKey === 'd') background.position.x -= 2
}

animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break

        case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break

        case 's':
        keys.s.pressed = true
        lastKey = 's'
        break

        case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        keys.w.pressed = false
        break

        case 'a':
        keys.a.pressed = false
        break

        case 's':
        keys.s.pressed = false
        break

        case 'd':
        keys.d.pressed = false
        break
    }
})