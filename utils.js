function isCircleRectCollision(circle, rectangle) {
  // Unpack circle properties
  const circleX = circle.x;
  const circleY = circle.y;
  const circleRadius = circle.radius;

  // Unpack rectangle properties
  const rectX = rectangle.centerX;
  const rectY = rectangle.centerY;
  const rectWidth = rectangle.width;
  const rectHeight = rectangle.height;
  const rectRotation = rectangle.degree * Math.PI / 180;
  // console.log(rectRotation)

  // Rotate circle's center point by negative rotation angle of rectangle
  const rotatedCircleX =
    Math.cos(-rectRotation) * (circleX - rectX) -
    Math.sin(-rectRotation) * (circleY - rectY) +
    rectX;
  const rotatedCircleY =
    Math.sin(-rectRotation) * (circleX - rectX) +
    Math.cos(-rectRotation) * (circleY - rectY) +
    rectY;

  // Calculate closest point inside the rectangle to the center of the circle
  let closestX, closestY;

  if (rotatedCircleX < rectX) {
    closestX = rectX;
  } else if (rotatedCircleX > rectX + rectWidth) {
    closestX = rectX + rectWidth;
  } else {
    closestX = rotatedCircleX;
  }

  if (rotatedCircleY < rectY) {
    closestY = rectY;
  } else if (rotatedCircleY > rectY + rectHeight) {
    closestY = rectY + rectHeight;
  } else {
    closestY = rotatedCircleY;
  }

  // Check if the closest point inside the rectangle is inside the circle
  const distanceX = rotatedCircleX - closestX;
  const distanceY = rotatedCircleY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  return distanceSquared <= circleRadius * circleRadius;
}
