const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
playerInventory = inventory()

canvas.width = 1200
canvas.height = 700

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 42) {
    collisionsMap.push(collisions.slice(i, 42 + i))
}

const caveEntersMap = []
for (let i = 0; i < caveEntersData.length; i += 42) {
    caveEntersMap.push(caveEntersData.slice(i, 42 + i))
}

const boundaries = []

const offset = {
    x: -105,
    y: -3200
    // y: -3100
}
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 3690)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }
            )
        )
    })
})

c.fillStyle = "White"
c.fillRect(0, 0, canvas.width, canvas.height)

const caveEnters = []

caveEntersMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 3690)
            caveEnters.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }
                )
            )
    })
})

const image = new Image()
image.src = 'Map.png'

const foregroundImage = new Image()
foregroundImage.src = 'ForegroundObjects.png'


const playerUpImage = new Image()
playerUpImage.src = '../PLAYER/Player_walk_up.png'

const playerLeftImage = new Image()
playerLeftImage.src = '../PLAYER/Player_walk_left.png'

const playerRightImage = new Image()
playerRightImage.src = '../PLAYER/Player_walk_right.png'

const playerDownImage = new Image()
playerDownImage.src = '../PLAYER/Player_walk_down.png'


const player = new Sprite({
    position: {
        x: canvas.width / 2 - 256 / 4 / 2,
        y: canvas.height / 2 - 63 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
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

const movables = [background, ...boundaries, ...caveEnters, foreground]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )

}

const cave = {
    initiated: false
}

function animate() {
    const animationID = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(Boundary => {
        Boundary.draw()
    })
    caveEnters.forEach((caveEnters) => {
        caveEnters.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.moving = false

    if (cave.enter) return

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < caveEnters.length; i++) {
            const caveEnter = caveEnters[i]
            const overlappingArea =
                (Math.min(
                    player.position.x + player.width,
                    caveEnter.position.x + caveEnter.width
                ) -
                    Math.max(player.position.x, caveEnter.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    caveEnter.position.y + caveEnter.height
                ) -
                    Math.max(player.position.y, caveEnter.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: caveEnter
                }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.3
            ) {
            

                window.cancelAnimationFrame(animationID)

                cave.enter = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 2,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                // activate a new animation loop
                                initEnter()
                                animateEnter()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                            }
                        })
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...Boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                moving = false
                break
            }
        }


        if (moving)
            movables.forEach((movables) => {
                movables.position.y += 3.3
            })
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...Boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('colliding ')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movables) => {
                movables.position.x += 3.3
            })
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...Boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                console.log('colliding ')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movables) => {
                movables.position.y -= 3.3
            })
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...Boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('colliding ')
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach((movables) => {
                movables.position.x -= 3.3
            })
    }
    else if (keys.Escape.pressed && lastKey === 'Escape') {
    }
}

animate()

const caveBackgroundImage = new Image()
caveBackgroundImage.src = 'Cave.png'
const caveBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: caveBackgroundImage
})
function animateEnter() {
    window.requestAnimationFrame(animateEnter)
    caveBackground.draw()
}

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
        
        case 'Escape':
            keys.Escape.pressed
            lastKey = 'Escape'
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

        case 'Escape':
            keys.Escape.pressed = false
            break
    }
})

