function isCircleRectCollision(circle, rectangle) {
  // Unpack circle properties
  const circleX = circle.x - 10
  const circleY = circle.y + 20
  const circleRadius = circle.radius

  // Unpack rectangle properties
  const rectX = rectangle.centerX
  const rectY = rectangle.centerY
  const rectWidth = rectangle.width
  const rectHeight = rectangle.height
  const rectRotation = (rectangle.degree * Math.PI) / 180
  // console.log(rectRotation)

  // Rotate circle's center point by negative rotation angle of rectangle
  const rotatedCircleX =
    Math.cos(-rectRotation) * (circleX - rectX) -
    Math.sin(-rectRotation) * (circleY - rectY) +
    rectX
  const rotatedCircleY =
    Math.sin(-rectRotation) * (circleX - rectX) +
    Math.cos(-rectRotation) * (circleY - rectY) +
    rectY

  // Calculate closest point inside the rectangle to the center of the circle
  let closestX, closestY

  if (rotatedCircleX < rectX) {
    closestX = rectX
  } else if (rotatedCircleX > rectX + rectWidth) {
    closestX = rectX + rectWidth
  } else {
    closestX = rotatedCircleX
  }

  if (rotatedCircleY < rectY) {
    closestY = rectY
  } else if (rotatedCircleY > rectY + rectHeight) {
    closestY = rectY + rectHeight
  } else {
    closestY = rotatedCircleY
  }

  // Check if the closest point inside the rectangle is inside the circle
  const distanceX = rotatedCircleX - closestX
  const distanceY = rotatedCircleY - closestY
  const distanceSquared = distanceX * distanceX + distanceY * distanceY

  return distanceSquared <= circleRadius * circleRadius
}

// return true if birdie is in racketHitBox, but not in racketFalseHitBox
function isBirdieRacketCollision(birdie, racketHitBox, racketFalseHitBox) {
  return (
    Math.hypot(birdie.x - racketHitBox.x, birdie.y - racketHitBox.y) <=
      birdie.radius + racketHitBox.radius &&
    !(
      Math.hypot(birdie.x - racketFalseHitBox.x, birdie.y - racketFalseHitBox.y) <=
      birdie.radius + racketFalseHitBox.radius
    )
  )
}

function resetPlayer() {
  rightPlayer.x = canvas.width - 100 + rightPlayer.width
  rightPlayer.y = canvas.height - rightPlayer.height

  leftPlayer.x = 100
  leftPlayer.y = canvas.height - leftPlayer.height
}

function checkPolygonsCollide(polygon1, polygon2) {
  // Check if any of the edges of polygon1 intersect with polygon2
  for (let i = 0; i < polygon1.length; i++) {
    // console.log(i, (i + 1) % polygon1.length)
    const p1 = polygon1[i]
    const p2 = polygon1[(i + 1) % polygon1.length]
    if (isIntersecting(p1, p2, polygon2)) {
      return true
    }
  }

  // Check if any of the edges of polygon2 intersect with polygon1
  for (let i = 0; i < polygon2.length; i++) {
    // console.log(i, (i + 1) % polygon2.length)
    const p1 = polygon2[i]
    const p2 = polygon2[(i + 1) % polygon2.length]
    if (isIntersecting(p1, p2, polygon1)) {
      return true
    }
  }

  // If no intersections found, polygons do not collide
  return false
}

function isIntersecting(p1, p2, polygon) {
  for (let i = 0; i < polygon.length; i++) {
    const p3 = polygon[i]
    const p4 = polygon[(i + 1) % polygon.length]
    if (doLineSegmentsIntersect(p1, p2, p3, p4)) {
      return true
    }
  }
  return false
}

function doLineSegmentsIntersect(p1, p2, p3, p4) {
  const d1 = getDirection(p3, p4, p1)
  const d2 = getDirection(p3, p4, p2)
  const d3 = getDirection(p1, p2, p3)
  const d4 = getDirection(p1, p2, p4)

  // Check if the line segments are intersecting
  if (d1 !== d2 && d3 !== d4) {
    return true
  }

  // Check for special cases where line segments are collinear
  if (d1 === 0 && isPointOnSegment(p3, p4, p1)) {
    return true
  }
  if (d2 === 0 && isPointOnSegment(p3, p4, p2)) {
    return true
  }
  if (d3 === 0 && isPointOnSegment(p1, p2, p3)) {
    return true
  }
  if (d4 === 0 && isPointOnSegment(p1, p2, p4)) {
    return true
  }

  // No intersection found
  return false
}

function getDirection(p1, p2, p3) {
  const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y)

  if (val === 0) {
    return 0 // Collinear
  } else if (val < 0) {
    return 1 // Clockwise
  } else {
    return 2 // Counterclockwise
  }
}

function isPointOnSegment(p1, p2, p3) {
  return (
    Math.min(p1.x, p2.x) <= p3.x &&
    p3.x <= Math.max(p1.x, p2.x) &&
    Math.min(p1.y, p2.y) <= p3.y &&
    p3.y <= Math.max(p1.y, p2.y)
  )
}

// rotation
function rotatePolygon(vertices, degree, pivotX, pivotY) {
  const radian = degree * (Math.PI / 180) // Convert degrees to radians
  const rotatedVertices = []

  for (let i = 0; i < vertices.length; i++) {
    const { x, y } = vertices[i]
    const translatedX = x - pivotX
    const translatedY = y - pivotY

    const rotatedX = translatedX * Math.cos(radian) - translatedY * Math.sin(radian)
    const rotatedY = translatedX * Math.sin(radian) + translatedY * Math.cos(radian)

    const finalX = rotatedX + pivotX
    const finalY = rotatedY + pivotY

    rotatedVertices.push({ x: finalX, y: finalY })
  }

  return rotatedVertices
}

function getCenterX(vertices) {
  let sumX = 0
  for (let i = 0; i < vertices.length; i++) {
    sumX += vertices[i].x
  }
  return sumX / vertices.length
}

function getCenterY(vertices) {
  let sumY = 0
  for (let i = 0; i < vertices.length; i++) {
    sumY += vertices[i].y
  }
  return sumY / vertices.length
}

// return the maximum y of the given vertices
function getMaxY(vertices) {
  let maxY = 0
  for (let i = 0; i < vertices.length; i++) {
    maxY = vertices[i].y > maxY ? vertices[i].y : maxY
  }
  return maxY
}

// return the maximum x of the given vertices
function getMaxX(vertices) {
  let maxX = 0
  for (let i = 0; i < vertices.length; i++) {
    maxX = vertices[i].x > maxX ? vertices[i].x : maxX
  }
  return maxX
}

// return the minimum x of the given vertices
function getMinX(vertices) {
  let minX = 9999
  for (let i = 0; i < vertices.length; i++) {
    minX = vertices[i].x < minX ? vertices[i].x : minX
  }
  return minX
}

function setUpLeftServe() {
  // shrink left player right bound
  leftPlayer.xRightBound = canvas.width / 4

  // change racket into serving position
  leftPlayer.racket.degree = leftPlayer.racket.serveStartDegree
  leftPlayer.racket.isServing = true

  // change birdie into serving mode
  birdie.isServing = true
}

function setUpRightServe() {
  // shrink left player right bound
  rightPlayer.xLeftBound = canvas.width * 3 / 4

  // change racket into serving position and serving mode
  rightPlayer.racket.degree = rightPlayer.racket.serveStartDegree
  rightPlayer.racket.isServing = true

  // change birdie into serving mode
  birdie.isServing = true
}

function randomPlayerServe() {
  // randomly pick left or right player to serve
  if (Math.random() > 0.5) {
    gameState = 'Left Player Serving'
    setUpLeftServe()
  } else {
    gameState = 'Right Player Serving'
    setUpRightServe()
  }
}
