class Player {
  static width = 50
  static height = 100

  constructor({ x, y, veloX, veloY, imageSrc, side }) {
    this.x = x
    this.y = y
    this.width = Player.width
    this.height = Player.height
    this.veloX = veloX
    this.veloY = veloY
    this.image = new Image()
    this.image.src = imageSrc
    this.side = side
    this.racket = new Racket({
      player: this,
      offSet: { x: 15, y: -this.height * 0.7, angle: 50 },
      degree: {
        start: this.side === "right" ? 50 : -50,
        end: this.side === "right" ? -100 : 100,
      },
    })
    this.xLeftBound = this.side === "left" ? 0 : canvas.width * 0.5
    this.xRightBound = this.side === "left" ? canvas.width * 0.5 : canvas.width
  }

  draw() {
    // draw player
    c.fillStyle = "red"
    c.fillRect(this.x, this.y, this.width, this.height)

    // draw racket
    this.racket.draw()
  }

  update() {
    // gravity
    if (this.y + this.height + this.veloY >= canvas.height) {
      this.veloY = 0
      this.y = canvas.height - this.height
    } else {
      this.veloY += gravity
    }

    // x boundaries
    if (this.x + this.veloX <= this.xLeftBound) {
      this.x = this.xLeftBound
      this.veloX = 0
    } else if (this.x + this.width + this.veloX >= this.xRightBound) {
      this.x = this.xRightBound - this.width
      this.veloX = 0
    }

    // update racket
    this.racket.update()

    this.y += this.veloY
    this.x += this.veloX
  }
}

class Racket {
  constructor({ player, offSet, degree }) {
    this.player = player
    this.width = 20
    this.height = 100
    this.offSet = offSet
    this.x = this.player.x + this.offSet.x
    this.y = this.player.y + this.offSet.y
    this.degree = degree.start
    this.startDegree = degree.start
    this.endDegree = degree.end
    this.swingForth = false
    this.swingBack = false
    this.bottomX = this.x + this.width / 2
    this.bottomY = this.y + this.height
    this.centerX =
      this.x +
      this.width / 2 +
      Math.sin((this.degree * Math.PI) / 180) * (this.height / 2)
    this.centerY =
      this.y +
      this.height -
      Math.cos((this.degree * Math.PI) / 180) * (this.height / 2)

    this.hitBox = {
      x: this.centerX,
      y: this.centerY,
      radius: this.height / 2,
    }
    this.falseHitBox = {
      x: this.bottomX,
      y: this.bottomY,
      radius: this.height / 4,
    }
  }

  draw() {
    c.save()
    c.translate(this.x + this.width / 2, this.y + this.height)

    // Rotate the canvas by degree
    const angle = (this.degree * Math.PI) / 180
    c.rotate(angle)

    c.fillStyle = "green"
    c.translate(-this.width / 2, -this.height)
    c.fillRect(0, 0, this.width, this.height)

    c.restore()
  }

  update() {
    // keep x and y in sync with player's position
    this.x = this.player.x + this.offSet.x
    this.y = this.player.y + this.offSet.y

    // update center x, center y, bottom x, bottom y,
    // hitBox, and false hitBox
    this.centerX =
      this.x +
      this.width / 2 +
      Math.sin((this.degree * Math.PI) / 180) * (this.height / 2)

    this.centerY =
      this.y +
      this.height -
      Math.cos((this.degree * Math.PI) / 180) * (this.height / 2)

    this.bottomX = this.x + this.width / 2
    this.bottomY = this.y + this.height

    this.hitBox = {
      x: this.centerX,
      y: this.centerY,
      radius: this.height / 2,
    }
    this.falseHitBox = {
      x: this.bottomX,
      y: this.bottomY,
      radius: this.height / 4,
    }

    // swinging animation
    if (this.player.side === "right") {
      if (this.swingForth) {
        if (this.degree + racketSwingSpeed > this.endDegree)
          this.degree -= racketSwingSpeed
        else {
          this.degree = this.endDegree
          this.swingForth = false
          this.swingBack = true
        }
      } else if (this.swingBack) {
        if (this.degree + racketSwingSpeed < this.startDegree) {
          this.degree += racketSwingSpeed
        } else {
          this.degree = this.startDegree
          this.swingBack = false
        }
      }
    } else {
      if (this.swingForth) {
        if (this.degree + racketSwingSpeed < this.endDegree)
          this.degree += racketSwingSpeed
        else {
          this.degree = this.endDegree
          this.swingForth = false
          this.swingBack = true
        }
      } else if (this.swingBack) {
        if (this.degree - racketSwingSpeed > this.startDegree) {
          this.degree -= racketSwingSpeed
        } else {
          this.degree = this.startDegree
          this.swingBack = false
        }
      }
    }
  }
}

class Birdie {
  constructor({ x, y, veloX, veloY }) {
    this.x = x
    this.y = y
    this.veloX = veloX
    this.veloY = veloY
    this.degree = 0
    this.radius = 25
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)

    c.fillStyle = "green"
    c.fill()
    c.closePath()

    c.save()
    c.translate(this.x + this.width / 2, this.y + this.height)

    // // Rotate the canvas by degree
    // const angle = (this.degree * Math.PI) / 180
    // c.rotate(angle)

    // c.fillStyle = "green"
    // c.translate(-this.width / 2, -this.height)
    // c.fillRect(0, 0, this.width, this.height)

    // c.restore()
  }

  update() {
    this.x += this.veloX
    this.y += this.veloY

    // gravity
    if (this.y + this.radius + this.veloY >= canvas.height) {
      this.veloY = 0
      this.y = canvas.height - this.radius
    } else {
      this.veloY += gravity
    }

    // x bounds
    if (this.x - this.radius + this.veloX <= 0) {
      this.x = this.radius
      this.veloX = 10
    } else if (this.x + this.radius + this.veloX >= canvas.width) {
      this.x = canvas.width - this.radius
      this.veloX = -10
    }

    // air friction
    if (this.veloX != 0) this.veloX *= airFriction
  }
}
