const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 800
canvas.height = 500

gsap.to("#hello", { duration: 1, width: 200 })

// Constants
let gameFrame = 0

const gravity = 0.2
const jumpSpeed = 8
const playerSpeed = 1

const racketSwingSpeed = 10
const racketStartDegree = 50
const racketEndDegree = -100

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

let lastKey = null

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

const birdie = new Birdie({ x: 300, y: 400, veloX: 0, veloY: 0 })
let degrees = 0

// Animation Loop
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)


  // c.save()
  // c.translate(125, 150)

  // // Rotate the canvas by degree
  // // degrees += 1
  // const angle = (90 * Math.PI) / 180
  // c.rotate(angle)

  // c.translate(-25, -50)
  // c.fillStyle = "green"
  // c.fillRect(0, 0, 50, 100)

  // c.restore()

  //

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
  if (keys.left.pressed && lastKey === "left") {
    rightPlayer.x -= playerSpeed
  } else if (keys.right.pressed && lastKey === "right") {
    rightPlayer.x += playerSpeed
  }

  // leftPlayer y movement
  if (keys.w.pressed && leftPlayer.veloY === 0) {
    leftPlayer.veloY = -jumpSpeed
  }

  // leftPlayer x movement
  if (keys.a.pressed && lastKey === "a") {
    leftPlayer.x -= playerSpeed
  } else if (keys.d.pressed && lastKey === "d") {
    leftPlayer.x += playerSpeed
  }

  // update and draw birdie
  // birdie.update()
  birdie.draw()

  // collision detection betweem birdie and right player
  if (
    isCircleRectCollision(birdie, rightPlayer.racket) 
    // isCircleRectCollision(birdie, rightPlayer.racket) &&
    // rightPlayer.racket.swingForth
  ) {
    console.log('collision')
    birdie.veloY = -10
    birdie.veloX = -10
  }

  // collision detection betweem birdie and left player
  if (
    isCircleRectCollision(birdie, leftPlayer.racket) &&
    leftPlayer.racket.swingForth
  ) {
    birdie.veloY = -10
    birdie.veloX = 10
  }

  // update game frame
  gameFrame += 1
}

animate()

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "ArrowUp":
      keys.up.pressed = true
      break
    case "ArrowDown":
      keys.down.pressed = true
      rightPlayer.racket.swingForth = true
      break
    case "ArrowLeft":
      keys.left.pressed = true
      lastKey = "left"
      break
    case "ArrowRight":
      keys.right.pressed = true
      lastKey = "right"
      break

    case "KeyW":
      keys.w.pressed = true
      break
    case "KeyA":
      keys.a.pressed = true
      lastKey = "a"
      console.log(keys.a.pressed)
      break
    case "KeyS":
      keys.s.pressed = true
      leftPlayer.racket.swingForth = true
      break
    case "KeyD":
      keys.d.pressed = true
      lastKey = "d"
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
