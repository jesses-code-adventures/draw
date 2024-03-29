//@ts-check

/**
 * A point that will be drawn
 */
export class Point {
  /**
   * Creates a point
   * @param {number} x
   * @param {number} y
   * @param {string} lineColour
   * @param {string} fillColour
   * @param {number} lineWidth
   * @param {boolean} lineStart
   */
  constructor(x, y, lineColour, fillColour, lineWidth, lineStart) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {string} */
    this.strokeColour = lineColour;
    /** @type {string} */
    this.fillColour = fillColour;
    /** @type {number} */
    this.lineWidth = lineWidth;
    /** @type {boolean} */
    this.lineEnd = false;
    /** @type {boolean} */
    this.lineStart = lineStart;
  }

  /**
   * @param {boolean} value
   */
  setLineEnd(value) {
    this.lineEnd = value;
  }
}

/**
 * Contains the draw state and a render function
 * @class
 */
export class DrawState {
  /**
   * Creates a DrawState
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   */
  constructor(ctx, canvas) {
    /** @type {boolean} */
    this.isDrawing = false;
    /** @type {Array.<Point>} */
    this.points = [];
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @type {MediaQueryList} */
    this.darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    /** @type {number} */
    this.lineWidth = 5;
    if (this.darkMode.matches) {
      /** @type {string} */
      this.strokeColour = "white";
      /** @type {string} */
      this.fillColour = "white";
    } else {
      /** @type {string} */
      this.strokeColour = "black";
      /** @type {string} */
      this.fillColour = "black";
    }
  }

  /**
   * @param {boolean} value
   */
  setIsDrawing(value) {
    this.isDrawing = value;
    if (value) {
      this.ctx.beginPath();
    } else {
      this.ctx.closePath();
    }
  }

  /**
   * Add a point to the drawState
   * @param {number} x
   * @param {number} y
   * @param {boolean} lineStart
   */
  addPoint(x, y, lineStart) {
    const point = new Point(
      x,
      y,
      this.strokeColour,
      this.fillColour,
      this.lineWidth,
      lineStart,
    );
    this.points.push(point);
    this.renderPoint(point);
  }

  clearPoints() {
    this.points = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getLastPoint() {
    return this.points[this.points.length - 1];
  }

  /**
   * @param {Point} point
   */
  syncColours(point) {
    if (point.strokeColour !== this.strokeColour) {
      this.strokeColour = point.strokeColour;
    }
    this.ctx.strokeStyle = this.strokeColour;
    if (point.fillColour !== this.fillColour) {
      this.fillColour = point.fillColour;
    }
    this.ctx.fillStyle = this.fillColour;
    if (this.lineWidth !== point.lineWidth) {
      this.lineWidth = point.lineWidth;
    }
    this.ctx.lineWidth = this.lineWidth;
  }

  /**
   * @param {Point} point
   * @private
   */
  renderPoint(point) {
    if (!this.ctx) {
      console.log("ctx is undefined");
      return;
    }
    this.syncColours(point);
    if (point.lineStart) {
      this.ctx.moveTo(point.x, point.y);
    }
    this.ctx.lineTo(point.x, point.y);
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }

  rerender() {
    for (let i = 0; i < this.points.length; i++) {
      this.renderPoint(this.points[i]);
    }
  }
}
