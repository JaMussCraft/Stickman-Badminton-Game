const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 800
canvas.height = 500

// Constants
// Ensures consistent FPS for every monitor
let msPrev = window.performance.now()
const fps = 10
const msPerFrame = 1000 / fps
let frames = 0

// Possible game states: 'Mid Game', 'Left Player Serving',
// 'Right Player Serving', 'Start Screen',
// 'Right Player Won', 'Left Player Won',
// 'Pause Between Rounds'
let gameState = 'Start Screen'
let lastWon = null
let leftScore = 0
let rightScore = 0
const pointsToWin = 3
let lastHit = null // 'left' or 'right'

const gravity = 0.3
const jumpSpeed = 8
const playerSpeed = 10

const racketSwingSpeed = 15
const racketStartDegree = 50
const racketEndDegree = -100

const birdieXSpeed = Math.round(canvas.width / 40)
const birdieYSpeed = Math.round(canvas.height / 40)
const airFriction = 0.97
const bounceFriction = 0.1
const netTopY = (canvas.height * 5) / 6 // y for the top of net
const netX = canvas.width / 2 // x for the net

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
  imageSrc: 'img/right-player/standing.png',
  side: 'right',
})

const leftPlayer = new Player({
  x: 100,
  y: 200,
  veloX: 0,
  veloY: 0,
  imageSrc: 'img/left-player/standing.png',
  side: 'left',
})

const birdie = new Birdie({
  vertices: [
    { x: 100, y: 100 },
    { x: 120, y: 140 },
    { x: 80, y: 140 },
  ],
  veloX: 0,
  veloY: 0,
  isServing: false,
  imageSrc: 'img/birdie.png',
})
birdie.setCenterX(250)
birdie.setCenterY(400)

const net = new Net({
  vertices: [
    { x: canvas.width / 2 - 12.5, y: canvas.height - 100 },
    { x: canvas.width / 2 + 12.5, y: canvas.height - 80 },
    { x: canvas.width / 2 + 12.5, y: canvas.height },
    { x: canvas.width / 2 - 12.5, y: canvas.height },
  ],
  imageSrc: 'img/net.png',
})

// html elements
const startScreen = document.querySelector('#startScreen')

const scoreDiv = document.querySelector('#scoreDiv')
const leftScoreEl = document.querySelector('#leftScore')
const rightScoreEl = document.querySelector('#rightScore')
const startScreenText = document.querySelector('#startScreenText')

const startButton = document.querySelector('#startButton')
startButton.onclick = () => {
  // hide startScreen
  startScreen.classList.add('hidden')

  // randomly pick left or right player to serve
  randomPlayerServe()

  // reset scores
  leftScore = rightScore = 0

  // display score
  scoreDiv.classList.remove('hidden')
}

// Animation Loop
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)

  const msNow = window.performance.now()
  const msPassed = msNow - msPrev

  if (msPassed < msPerFrame) return

  // birdie.setDegree(0)

  c.fillStyle = 'grey'
  c.fillRect(0, 0, canvas.width, canvas.height)

  // update and draw rightPlayer
  rightPlayer.update()
  rightPlayer.draw()

  // update and draw leftPlayer
  leftPlayer.update()
  leftPlayer.draw()

  // rightPlayer y movement
  if (keys.up.pressed && rightPlayer.veloY === 0 && gameState != 'Right Player Serving') {
    rightPlayer.veloY = -jumpSpeed
  }

  // rightPlayer x movement
  if (
    keys.left.pressed &&
    lastKey.rightPlayer === 'left' &&
    rightPlayer.x - playerSpeed >= rightPlayer.xLeftBound
  ) {
    rightPlayer.x -= playerSpeed
  } else if (
    keys.right.pressed &&
    lastKey.rightPlayer === 'right' &&
    rightPlayer.x + rightPlayer.width + playerSpeed <= rightPlayer.xRightBound
  ) {
    rightPlayer.x += playerSpeed
  }

  // rightPlayer swing
  if (keys.down.pressed && !rightPlayer.racket.swingBack) rightPlayer.racket.swingForth = true

  // leftPlayer y movement
  if (keys.w.pressed && leftPlayer.veloY === 0 && gameState != 'Left Player Serving') {
    leftPlayer.veloY = -jumpSpeed
  }

  // leftPlayer x movement
  if (
    keys.a.pressed &&
    lastKey.leftPlayer === 'a' &&
    leftPlayer.x - playerSpeed >= leftPlayer.xLeftBound
  ) {
    leftPlayer.x -= playerSpeed
  } else if (
    keys.d.pressed &&
    lastKey.leftPlayer === 'd' &&
    leftPlayer.x + leftPlayer.width + playerSpeed <= leftPlayer.xRightBound
  ) {
    leftPlayer.x += playerSpeed
  }

  // leftPlayer swing
  if (keys.s.pressed && !leftPlayer.racket.swingBack) leftPlayer.racket.swingForth = true

  // update and draw birdie
  birdie.update()
  birdie.draw()

  // update and draw net
  net.update()
  net.draw()

  // state machine
  if (gameState === 'Start Screen') {
    // nothing for now
  } else if (gameState === 'Mid Game') {
    // reset player boundaries
    rightPlayer.xLeftBound = canvas.width * 0.5 + 100
    leftPlayer.xRightBound = canvas.width * 0.5 - 100

    // collision detection betweem birdie and right player racket
    console.log(rightPlayer.racket.swingForth)
    if (
      !rightPlayer.racket.hitting &&
      rightPlayer.racket.swingForth &&
      checkPolygonsCollide(birdie.vertices, rightPlayer.racket.vertices)
    ) {
      lastHit = 'right'
      rightPlayer.racket.hitting = true
      setTimeout(() => {
        rightPlayer.racket.hitting = false
      }, 1000)

      if (!rightPlayer.racket.isServing && rightPlayer.racket.degree < -20) {
        birdie.veloY = birdieYSpeed
        birdie.veloX = -birdieXSpeed * 2 // faster for smashing
      } else {
        birdie.veloY = -birdieYSpeed
        birdie.veloX = -birdieXSpeed
      }
    }

    // collision detection betweem birdie and left player
    if (
      !leftPlayer.racket.hitting &&
      leftPlayer.racket.swingForth &&
      checkPolygonsCollide(birdie.vertices, leftPlayer.racket.vertices)
    ) {
      lastHit = 'left'
      leftPlayer.racket.hitting = true
      setTimeout(() => {
        leftPlayer.racket.hitting = false
      }, 1000)

      if (!leftPlayer.racket.isServing && leftPlayer.racket.degree > 20) {
        birdie.veloY = birdieYSpeed
        birdie.veloX = birdieXSpeed * 2 // faster for smashing
      } else {
        birdie.veloY = -birdieYSpeed
        birdie.veloX = birdieXSpeed
      }
    }

    // collision detection between birdie and net
    if (checkPolygonsCollide(birdie.vertices, net.vertices)) {
      // change birdie to hitting net mode
      birdie.hittingNet = true

      // stop birdie from flying anywhere
      birdie.veloX = birdie.veloY = 0
    }

    // end round when birdie hitting net
    if (birdie.hittingNet) {
      if (lastHit === 'left') {
        // right wins
        rightScore += 1

        // winner keeps serving
        setTimeout(() => {
          gameState = 'Right Player Serving'
          setUpRightServe()
        }, 500)
      } else {
        // left wins
        leftScore += 1

        // winner keeps serving
        setTimeout(() => {
          gameState = 'Left Player Serving'
          setUpLeftServe()
        }, 500)
      }
      gameState = 'Pause Between Rounds'
      birdie.hittingNet = false
    }

    // when birdie hits the ground
    if (getMaxY(birdie.vertices) + birdie.veloY === canvas.height) {
      if (birdie.centerX < leftPlayer.xRightBound) {
        // right wins
        rightScore += 1

        // winner keeps serving
        gameState = 'Right Player Serving'
        setUpRightServe()
      } else {
        // left wins
        leftScore += 1

        // winner keeps serving
        gameState = 'Left Player Serving'
        setUpLeftServe()
      }
    }

    // end game when one player has enough points
    if (leftScore >= pointsToWin) {
      gameState = 'Left Player Won'
      resetPlayer()
    } else if (rightScore >= pointsToWin) {
      gameState = 'Right Player Won'
      resetPlayer()
    }
  } else if (gameState === 'Left Player Serving') {
    // constantly repositioning birdie to the right serving position
    if (birdie.isServing) {
      birdie.setCenterX(leftPlayer.x + 70)
      birdie.setCenterY(leftPlayer.y + 50)
      birdie.setDegree(200)
    }

    // move birdie when player swings
    if (leftPlayer.racket.swingForth) {
      birdie.isServing = false
      // birdie.veloY = -birdieYSpeed
      // birdie.veloX = birdieXSpeed
      console.log('switcht to mid game')

      // change game state
      gameState = 'Mid Game'
    }
  } else if (gameState === 'Right Player Serving') {
    // constantly repositioning birdie to the right serving position
    if (birdie.isServing) {
      birdie.setCenterX(rightPlayer.x - 20)
      birdie.setCenterY(rightPlayer.y + 50)
      birdie.setDegree(150)
    }

    // move birdie when player swings
    if (rightPlayer.racket.swingForth) {
      birdie.isServing = false
      // birdie.veloY = -birdieYSpeed
      // birdie.veloX = -birdieXSpeed

      console.log('asdfsdf')
      // change game state
      gameState = 'Mid Game'
    }
  } else if (gameState === 'Right Player Won') {
    startScreen.classList.remove('hidden')
    startScreenText.innerHTML = 'Left Player Won'
  } else if (gameState === 'Left Player Won') {
    startScreen.classList.remove('hidden')
    startScreenText.innerHTML = 'Right Player Won'
  }

  // update score
  leftScoreEl.innerHTML = leftScore
  rightScoreEl.innerHTML = rightScore

  // take excess time between each render frame into account
  const excessTime = msPassed % msPerFrame
  msPrev = msNow - excessTime

  // update game frame
  frames++
}

animate()

addEventListener('keydown', ({ code }) => {
  switch (code) {
    case 'ArrowUp':
      keys.up.pressed = true
      break
    case 'ArrowDown':
      keys.down.pressed = true
      break
    case 'ArrowLeft':
      keys.left.pressed = true
      lastKey.rightPlayer = 'left'
      break
    case 'ArrowRight':
      keys.right.pressed = true
      lastKey.rightPlayer = 'right'
      break

    case 'KeyW':
      keys.w.pressed = true
      break
    case 'KeyA':
      keys.a.pressed = true
      lastKey.leftPlayer = 'a'
      break
    case 'KeyS':
      keys.s.pressed = true
      break
    case 'KeyD':
      keys.d.pressed = true
      lastKey.leftPlayer = 'd'
      break

    default:
      break
  }
})

addEventListener('keyup', ({ code }) => {
  switch (code) {
    case 'ArrowUp':
      keys.up.pressed = false
      break
    case 'ArrowDown':
      keys.down.pressed = false
      break
    case 'ArrowLeft':
      keys.left.pressed = false
      break
    case 'ArrowRight':
      keys.right.pressed = false
      break

    case 'KeyW':
      keys.w.pressed = false
      break
    case 'KeyA':
      keys.a.pressed = false
      break
    case 'KeyS':
      keys.s.pressed = false
      break
    case 'KeyD':
      keys.d.pressed = false
      break

    default:
      break
  }
})
