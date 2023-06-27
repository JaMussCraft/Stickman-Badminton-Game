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
      vertices: [
        { x: 400, y: 400 },
        { x: 425, y: 400 },
        { x: 425, y: 475 },
        { x: 400, y: 475 },
      ],
      player: this,
      offSetX: this.side === 'right' ? 0 : -20,
      degree: {
        start: this.side === 'right' ? 50 : -50,
        end: this.side === 'right' ? -100 : 100,
        serveStart: this.side === 'right' ? 120 : 245,
        serveEnd: this.side === 'right' ? 275 : 90,
      },
      imageSrc: 'img/blue-racket.png',
    })
    this.xLeftBound = this.side === 'left' ? 45 : canvas.width * 0.5 + 100
    this.xRightBound = this.side === 'left' ? canvas.width * 0.5 - 100 : canvas.width - 45
  }

  draw() {
    // draw player
    // c.fillStyle = 'red'
    // c.fillRect(this.x, this.y, this.width, this.height)

    c.drawImage(this.image, this.x, this.y)

    // draw racket
    this.racket.draw()
  }

  update() {
    // gravity
    if (this.y + this.height + this.veloY >= canvas.height - 35) {
      this.veloY = 0
      this.y = canvas.height - 35 - this.height
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
  constructor({ vertices, player, offSetX, degree, imageSrc }) {
    this.player = player

    this.vertices = vertices
    this.width = 20
    this.height = 100
    this.offSetX = offSetX

    this.degree = degree.start
    this.startDegree = degree.start
    this.endDegree = degree.end
    this.serveStartDegree = degree.serveStart
    this.serveEndDegree = degree.serveEnd
    this.isServing = false

    this.swingForth = false
    this.swingBack = false
    this.hitting = false

    this.centerX = getCenterX(this.vertices)
    this.centerY = getCenterY(this.vertices)

    // position at which the racket rotates
    this.pivotX = this.player.x + this.player.width / 2 + this.offSetX
    this.pivotY = this.player.y + this.player.height / 5

    this.image = new Image()
    this.image.src = imageSrc
    this.image.onload = () => {
      this.pattern = c.createPattern(this.image, 'no-repeat')
    }
  }

  draw() {
    c.beginPath()
    c.moveTo(this.vertices[0].x, this.vertices[0].y)
    c.lineTo(this.vertices[1].x, this.vertices[1].y)
    c.lineTo(this.vertices[2].x, this.vertices[2].y)
    c.lineTo(this.vertices[3].x, this.vertices[3].y)
    c.closePath()
    c.fillStyle = 'orange'
    c.fill()

    // c.save()
    // c.translate(this.pivotX, this.pivotY)

    // // Rotate the canvas by degree
    // const angle = (this.degree * Math.PI) / 180
    // c.rotate(angle)

    // c.translate(-this.pivotX, -this.pivotY)

    // // 25 and 30 are the offsets to make the birdie png match the birdie triangle
    // c.drawImage(this.image, this.vertices[0].x, this.vertices[0].y)
    // // c.drawImage(this.image, this.pivotX - 5, this.pivotY - 108)

    // c.restore()
  }

  update() {
    // update center x y, pivot x y
    this.centerX = getCenterX(this.vertices)
    this.centerY = getCenterY(this.vertices)

    this.pivotX = this.player.x + this.player.width / 2 + this.offSetX
    this.pivotY = this.player.y + this.player.height * 0.5

    // update this.vertices
    this.vertices = [
      { x: this.pivotX, y: this.pivotY - this.height },
      { x: this.pivotX + this.width, y: this.pivotY - this.height },
      { x: this.pivotX + this.width, y: this.pivotY },
      { x: this.pivotX, y: this.pivotY },
    ]

    this.vertices = rotatePolygon(
      this.vertices,
      this.degree,
      this.pivotX + this.width / 2,
      this.pivotY
    )

    // swinging animation

    switch (this.player.side) {
      case 'right':
        if (this.isServing) {
          // serving
          if (this.swingForth) {
            if (this.degree + racketSwingSpeed < this.serveEndDegree) {
              this.degree += racketSwingSpeed
            } else {
              this.degree = this.serveEndDegree
              this.swingForth = false
              this.swingBack = true
            }
          } else if (this.swingBack) {
            if (this.degree + racketSwingSpeed > this.serveStartDegree)
              this.degree -= racketSwingSpeed
            else {
              this.degree = this.startDegree
              this.swingBack = false
              this.isServing = false
            }
          }
        } else {
          // not serving, normal clearing and smashing
          if (this.swingForth) {
            if (this.degree + racketSwingSpeed > this.endDegree) this.degree -= racketSwingSpeed
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
        }

        break

      case 'left':
        if (this.isServing) {
          if (this.swingForth) {
            if (this.degree - racketSwingSpeed > this.serveEndDegree)
              this.degree -= racketSwingSpeed
            else {
              this.degree = this.serveEndDegree
              this.swingForth = false
              this.swingBack = true
            }
          } else if (this.swingBack) {
            if (this.degree + racketSwingSpeed < this.serveStartDegree) {
              this.degree += racketSwingSpeed
            } else {
              this.degree = this.startDegree
              this.swingBack = false
              this.isServing = false
            }
          }
        } else {
          // normal hitting animation
          if (this.swingForth) {
            if (this.degree + racketSwingSpeed < this.endDegree) this.degree += racketSwingSpeed
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

        break

      default:
        break
    }
  }
}

class Birdie {
  constructor({ vertices, veloX, veloY, isServing, imageSrc, scale }) {
    this.vertices = vertices
    this.centerX = getCenterX(this.vertices)
    this.centerY = getCenterY(this.vertices)
    this.veloX = veloX
    this.veloY = veloY
    this.degree = 0
    this.isServing = isServing
    this.bouncing = false
    this.hittingNet = false

    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
  }

  draw() {
    // // birdie triangle
    // c.beginPath()
    // c.moveTo(this.vertices[0].x, this.vertices[0].y)
    // c.lineTo(this.vertices[1].x, this.vertices[1].y)
    // c.lineTo(this.vertices[2].x, this.vertices[2].y)
    // c.closePath()
    // c.fillStyle = 'cyan'
    // c.fill()


    c.save()
    c.translate(this.centerX, this.centerY)

    // Rotate the canvas by degree
    const angle = (this.degree * Math.PI) / 180
    c.rotate(angle)

    c.translate(-this.centerX, -this.centerY)

    // 25 and 30 are the offsets to make the birdie png match the birdie triangle
    c.drawImage(
      this.image,
      this.centerX - 15,
      this.centerY - 20,
      this.image.height * this.scale,
      this.image.width * this.scale
    )

    c.restore()
  }

  update() {
    // no update if serving
    if (this.isServing) return

    // veloX and veloY should be applied to centerX and centerY
    // and all x's and y's in this.vertices
    this.setCenterX(this.centerX + this.veloX)
    this.setCenterY(this.centerY + this.veloY)

    const maxY = getMaxY(this.vertices)

    // bounce on landing
    if (this.veloY != 0 && maxY + this.veloY >= canvas.height) {
      this.bouncing = true
      this.veloY *= -bounceFriction
    }

    // gravity and y boundaries
    if (maxY + this.veloY >= canvas.height - 20) {
      this.veloY = 0
      this.setCenterY(canvas.height - 20 - (maxY - this.centerY))
    } else {
      this.veloY += gravity
    }

    // x bounds
    const minX = getMinX(this.vertices)
    const maxX = getMaxX(this.vertices)
    if (minX + this.veloX <= 45) {
      // this.setCenterX(this.centerX - minX)
      this.veloX *= -1
    } else if (maxX + this.veloX >= canvas.width - 45) {
      // this.setCenterX(canvas.width - (maxX - this.centerX))
      this.veloX *= -1
    }

    // // collision detection between birdie and net
    // if (maxY >= netTopY && maxX > netX && minX < netX) {
    //   this.hittingNet = true
    //   this.veloX = this.veloY = 0
    // }

    // air friction
    if (this.veloX != 0) this.veloX *= airFriction

    // make birdie completely stop when touching the ground
    if (this.veloX != 0 && this.veloY == 0) this.veloX = 0

    // set degree based on the direction the birdie is travelling
    if (this.veloX != 0) {
      if (this.veloX > 0) {
        const radian = Math.atan(this.veloY / this.veloX)
        const degree = (radian * 180) / Math.PI
        this.setDegree(degree + 90)
      } else {
        // this.veloX < 0
        const radian = Math.atan(this.veloY / this.veloX)
        const degree = (radian * 180) / Math.PI
        this.setDegree(degree - 90)
      }
    } else {
      // veloX is 0
      if (this.veloY > 0 && !this.bouncing) {
        this.setDegree(180)
      } else if (this.veloY === 0 && this.bouncing) {
        if (this.degree < 180) {
          this.setDegree(101)
        } else {
          this.setDegree(264)
        }
      } else if (this.veloY < 0) {
        if (this.degree > 0) {
          // goal is 101 degrees
          if (this.degree > 101) this.degree -= 1
          else this.degree += 1
        } else {
          // goal is -101 degrees
          if (this.degree < -101) this.degree += 1
          else this.degree -= 1
        }
      }
    }
  }

  setCenterX(centerX) {
    const diff = centerX - this.centerX
    this.centerX += diff
    this.shiftVertices(diff, 0)
  }

  setCenterY(centerY) {
    const diff = centerY - this.centerY
    this.centerY += diff
    this.shiftVertices(0, diff)
  }

  setDegree(goalDegree) {
    // differences between goal degree and current degree
    const diff = goalDegree - this.degree
    this.vertices = rotatePolygon(this.vertices, diff, this.centerX, this.centerY)
    // set current degree to goal degree
    this.degree = goalDegree
  }

  shiftVertices(distX, distY) {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].x += distX
      this.vertices[i].y += distY
    }
  }
}

class Net {
  constructor({ vertices, imageSrc }) {
    this.vertices = vertices
    this.image = new Image()
    this.image.src = imageSrc
    this.height = this.image.height
    this.width = this.image.width
  }

  draw() {
    // draw net polygon
    // c.beginPath()
    // c.moveTo(this.vertices[0].x, this.vertices[0].y)
    // c.lineTo(this.vertices[1].x, this.vertices[1].y)
    // c.lineTo(this.vertices[2].x, this.vertices[2].y)
    // c.lineTo(this.vertices[3].x, this.vertices[3].y)
    // c.closePath()
    // c.fillStyle = 'rgba(218,112,214,0.5)'
    // c.fill()
    // c.drawImage(this.image, canvas.width / 2 - this.width / 2, canvas.height - this.height)
  }

  update() {}
}
