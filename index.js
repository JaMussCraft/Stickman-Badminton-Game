const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 800
canvas.height = 500

gsap.to("#hello", { duration: 1, width: 200 })

// Constants
let gameFrame = 0
const gravity = 0.2
const jumpSpeed = 8
const playerSpeed = 10
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

const player = new Player({
  x: 200,
  y: 200,
  veloX: 0,
  veloY: 0,
  imageSrc: null,
})
// const leftPlayer = new leftPlayer()
// const rightPlayer = new rightPlayer()

// Animation Loop
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  // update and draw player
  player.update()
  player.draw()

  // player y movement
  if (keys.up.pressed && player.veloY === 0) {
    player.veloY = -jumpSpeed
  }

  // player x movement
  if (keys.left.pressed && lastKey === "left") {
    player.x -= playerSpeed
  } else if (keys.right.pressed && lastKey === "right") {
    player.x += playerSpeed
  }

  // racket animation
  // if (player.racket.degree > -100) {

  // }

  // if (gameFrame % 100) {
  //   player.racket.degree -= 1
  // }

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
      player.racket.swingForth = true
      console.log(player.racket.swingForth, player.racket.swingBack, player.racket.degree)

      console.log("should swing")
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
      break
    case "KeyS":
      keys.s.pressed = true
      lastKey = "s"
      break
    case "KeyD":
      keys.d.pressed = true
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