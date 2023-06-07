const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 800
canvas.height = 500

gsap.to("#hello", { duration: 1, width: 200 })

// Constants
let gameFrame = 0
// Possible game states: 'Game Over', 'Mid Game', 'Left Player Serving',
// 'Right Player Serving', 'Start Screen'
let gameState = "Start Screen"
let lastWon = null

const gravity = 0.4
const jumpSpeed = 8
const playerSpeed = 10

const racketSwingSpeed = 10
const racketStartDegree = 50
const racketEndDegree = -100

const birdieXSpeed = 10
const birdieYSpeed = 20
const airFriction = 0.97

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
}

let lastKey = { leftPlayer: null, rightPlayer: null }

const rightPlayer = new Player({
  x: 500,
  y: 200,
  veloX: 0,
  veloY: 0,
  imageSrc: null,
  side: "right",
})

const leftPlayer = new Player({
  x: 100,
  y: 200,
  veloX: 0,
  veloY: 0,
  imageSrc: null,
  side: "left",
})

const birdie = new Birdie({ x: 500, y: 400, veloX: 0, veloY: 0 })
let degrees = 0

// Animation Loop
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  // update and draw rightPlayer
  rightPlayer.update()
  rightPlayer.draw()

  // update and draw leftPlayer
  leftPlayer.update()
  leftPlayer.draw()

  // rightPlayer y movement
  if (keys.up.pressed && rightPlayer.veloY === 0) {
    rightPlayer.veloY = -jumpSpeed
  }

  // rightPlayer x movement
  if (keys.left.pressed && lastKey.rightPlayer === "left") {
    rightPlayer.x -= playerSpeed
  } else if (keys.right.pressed && lastKey.rightPlayer === "right") {
    rightPlayer.x += playerSpeed
  }

  // rightPlayer swing
  if (keys.down.pressed && !rightPlayer.racket.swingBack)
    rightPlayer.racket.swingForth = true

  // leftPlayer y movement
  if (keys.w.pressed && leftPlayer.veloY === 0) {
    leftPlayer.veloY = -jumpSpeed
  }

  // leftPlayer x movement
  if (keys.a.pressed && lastKey.leftPlayer === "a") {
    leftPlayer.x -= playerSpeed
  } else if (keys.d.pressed && lastKey.leftPlayer === "d") {
    leftPlayer.x += playerSpeed
  }

  // leftPlayer swing
  if (keys.s.pressed && !leftPlayer.racket.swingBack)
    leftPlayer.racket.swingForth = true

  // update and draw birdie
  birdie.update()
  birdie.draw()

  // collision detection betweem birdie and right player
  if (
    isBirdieRacketCollision(
      birdie,
      rightPlayer.racket.hitBox,
      rightPlayer.racket.falseHitBox
    ) &&
    rightPlayer.racket.swingForth
  ) {
    console.log("collision")
    birdie.veloY = -birdieYSpeed
    birdie.veloX = -birdieXSpeed
  }

  // collision detection betweem birdie and left player
  if (
    isBirdieRacketCollision(
      birdie,
      leftPlayer.racket.hitBox,
      leftPlayer.racket.falseHitBox
    ) &&
    leftPlayer.racket.swingForth
  ) {
    birdie.veloY = -birdieYSpeed
    birdie.veloX = birdieXSpeed
  }

  // update game frame
  gameFrame += 1
  
  // state machine
  if (gameState === 'Start Screen') {
    

  }
  else if (gameState === "Mid Game" && birdie.y + birdie.radius === canvas.height) {
    if (birdie.x < leftPlayer.xRightBound) {
      console.log("left Player lose")
    } else {
      console.log("right player loses")
    }
  }

  // c.beginPath()
  // c.arc(
  //   leftPlayer.racket.hitBox.x,
  //   leftPlayer.racket.hitBox.y,
  //   leftPlayer.racket.hitBox.radius,
  //   0,
  //   2 * Math.PI
  // )

  // c.fillStyle = "blue"
  // c.fill()
  // c.closePath()

  // c.beginPath()
  // c.arc(
  //   leftPlayer.racket.falseHitBox.x,
  //   leftPlayer.racket.falseHitBox.y,
  //   leftPlayer.racket.falseHitBox.radius,
  //   0,
  //   2 * Math.PI
  // )

  // c.fillStyle = "yellow"
  // c.fill()
  // c.closePath()
}

animate()

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "ArrowUp":
      keys.up.pressed = true
      break
    case "ArrowDown":
      keys.down.pressed = true
      break
    case "ArrowLeft":
      keys.left.pressed = true
      lastKey.rightPlayer = "left"
      break
    case "ArrowRight":
      keys.right.pressed = true
      lastKey.rightPlayer = "right"
      break

    case "KeyW":
      keys.w.pressed = true
      break
    case "KeyA":
      keys.a.pressed = true
      lastKey.leftPlayer = "a"
      break
    case "KeyS":
      keys.s.pressed = true
      break
    case "KeyD":
      keys.d.pressed = true
      lastKey.leftPlayer = "d"
      break

    default:
      break
  }
})

addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "ArrowUp":
      keys.up.pressed = false
      break
    case "ArrowDown":
      keys.down.pressed = false
      break
    case "ArrowLeft":
      keys.left.pressed = false
      break
    case "ArrowRight":
      keys.right.pressed = false
      break

    case "KeyW":
      keys.w.pressed = false
      break
    case "KeyA":
      keys.a.pressed = false
      break
    case "KeyS":
      keys.s.pressed = false
      break
    case "KeyD":
      keys.d.pressed = false
      break

    default:
      break
  }
})
