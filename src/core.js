/**
 * A point that will be drawn
 */
export class Point {
  /**
   * Creates a point
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
  }
}

/**
 * Contains the draw state and a render function
 * @class
 */
export class DrawState {
  constructor() {
    /** @type {boolean} */
    this.isDrawing = false;
    /** @type {Point | null} */
    this.currentPoint = null;
    /** @type {[]Point} */
    this.points = [];
  }

  /**
   * @param {boolean} value
   */
  setIsDrawing(value) {
    this.isDrawing = value;
  }

  /**
   * Add a point to the drawState, return the new point
   * @param {number} x
   * @param {number} y
   */
  addPoint(x, y) {
    const point = new Point(x, y);
    this.points.push(point);
    return point;
  }

  clearPoints() {
    this.points = [];
  }

  /**
   * @param {Point} point
   */
  setCurrentPoint(point) {
    this.currentPoint = point;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Point} point
   */
  renderPoint(ctx, point) {
    if (!ctx) {
      console.log("ctx is undefined");
      return;
    }
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  rerender(ctx) {
    console.log(this.points);
    for (let i = 0; i < this.points.length; i++) {
      this.renderPoint(ctx, this.points[i]);
    }
  }
}
