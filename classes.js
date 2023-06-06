class Player {
    static width = 50
    static height = 100
  
    constructor({ x, y, veloX, veloY, imageSrc }) {
      this.x = x
      this.y = y
      this.width = Player.width
      this.height = Player.height
      this.veloX = veloX
      this.veloY = veloY
      this.image = new Image()
      this.image.src = imageSrc
      this.racket = new Racket({
        player: this,
        offSet: { x: 15, y: -this.height * 0.7, angle: 50 },
      })
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
  
      // update racket
      this.racket.update()
  
      this.y += this.veloY
      this.x += this.veloX
    }
  }
  
  class Racket {
    static width = 20
    static height = 100
    constructor({ player, offSet }) {
      this.player = player
      this.width = Racket.width
      this.height = Racket.height
      this.offSet = offSet
      this.x = this.player.x + this.offSet.x
      this.y = this.player.y + this.offSet.y
      this.degree = 0
      this.swingForth = false
      this.swingBack = false
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
  
      if (this.swingForth && this.degree > -100 && gameFrame % 100) {
        this.degree -= 1
      } else if (this.swingForth && this.degree <= -100) {
        this.swingForth = false
        this.swingBack = true
      } 
  
      console.log(this.swingForth, this.swingBack)
  
      if (this.swingBack && this.degree < 0 && gameFrame % 100) {
        this.degree += 1
      } else if (this.swingBack && this.degree >= 0) {
        this.swingBack = false
      }
    }
  
    // swingForth() {
    //   if (this.degree > -100) {
    //     this.swingBack()
    //   }
  
    //   if (gameFrame % 100) {
    //     this.degree -= 1
    //     this.swingForth()
    //   }
  
    //   // if (!this.swingForth && !this.swingBack) {
    //   //   this.swingForth = true
  
    //   //   setTimeout(() => {
    //   //     this.swingForth = false
    //   //     this.swingBack = true
    //   //     setTimeout(() => {
    //   //       this.swingBack = false
  
    //   //     }, 500);
    //   //   }, 500)
    //   // }
    // }
  
    // swingBack() {
    //   if (this.degree < 100) {
    //     this.swingBack()
    //   }
  
    //   if (gameFrame % 100) {
    //     this.degree += 1
    //   }
    // }
  }