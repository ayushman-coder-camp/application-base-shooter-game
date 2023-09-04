const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const score = document.querySelector('#scoreNumber')
const gameOverModal = document.querySelector('.gameOverModal')
const gameOverButton = document.querySelector('.gameOverModal button')
const gameOverScore = document.querySelector('.gameOverModal h1')
const startGameModal = document.querySelector('.startGameModal')
const startGameButton = document.querySelector('.startGameModal button')

canvas.width = 1493
canvas.height = 800

class Player {
    constructor(x, y, radius, bg) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = bg
    }

    create() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, bg, vel) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = bg
        this.velocity = vel
    }

    drawPath() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    animatePath() {
        this.drawPath()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Giant {
    constructor(x, y, radius, bg, vel) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = bg
        this.velocity = vel
    }

    create() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    animate() {
        this.create()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const xAxis = canvas.width / 2
const yAxis = canvas.height / 2
const playerColor = 'white'

let player = new Player(xAxis, yAxis, 30, playerColor)
let projectiles = []
let giants = []

function init() {
    player = new Player(xAxis, yAxis, 30, playerColor)
    projectiles = []
    giants = []
    animationId
    score_value = 0
}

function createGiants() {
    setInterval(() => {
        const radius = Math.random() * (50 - 38) + 38
        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const clr = `hsl(${Math.random() * 265}, 50%, 50%)`
        const MathAngle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )

        const velocity = {
            x: Math.cos(MathAngle),
            y: Math.sin(MathAngle)
        }
        
        giants.push(new Giant(x, y, radius, clr, velocity))
    }, 1500)
}

let animationId
let score_value = 0
function animate() {
    animationId = requestAnimationFrame(animate)

    c.fillStyle = "rgba(0, 0, 0, 0.1)"
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.create()
    projectiles.forEach((projectile, i) => {
        projectile.animatePath()

        if (projectile.x - projectile.radius < 0) {
            if (
                projectile.x + projectile.radius < 0 ||
                projectile.x - projectile.radius > canvas.width ||
                projectile.y + projectile.radius < 0 ||
                projectile.y - projectile.radius > canvas.height
            ) {
                setTimeout(() => {
                    projectiles.splice(i, 1)
                }, 0);
            }
        }
    })

    giants.forEach((giant, i) => {
        giant.animate()

        const distance = Math.hypot(player.x - giant.x, player.y - giant.y)

        if (distance - giant.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            gameOverModal.style.display = 'flex'
            gameOverScore.innerHTML = score_value
        }

        projectiles.forEach((projectile, pI) => {
            const distance = Math.hypot(projectile.x - giant.x, projectile.y - giant.y)

            if (distance - giant.radius - projectile.radius < 1) {
                if (giant.radius > 39) {
                    gsap.to(giant, {
                        radius: giant.radius - 8
                    })
                    setTimeout(() => {
                        projectiles.splice(pI, 1)
                    }, 0);

                    score_value += 100
                    score.innerHTML = score_value
                } else {
                    setTimeout(() => {
                        giants.splice(i, 1)
                        projectiles.splice(pI, 1)
                    }, 0);

                    score_value += 250
                    score.innerHTML = score_value
                }
            }
        })
    })
}

addEventListener('click', (event) => {
    const MathAngle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )

    const vel = {
        x: Math.cos(MathAngle) * 7,
        y: Math.sin(MathAngle) * 7
    }

    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 10, playerColor, vel))
})

gameOverButton.addEventListener('click', () => {
    init()
    animate()
    createGiants()
    gameOverModal.style.display = 'none'
    score_value = 0
    score.innerHTML = score_value
})

startGameButton.addEventListener('click', () => {
    animate()
    createGiants()
    startGameModal.style.display = 'none'
})