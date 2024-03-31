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
   * @param {boolean} lineEnd
   */
  constructor(x, y, lineColour, fillColour, lineWidth, lineStart, lineEnd) {
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
    this.lineStart = lineStart;
    /** @type {boolean} */
    this.lineEnd = lineEnd;
  }

  /**
   * @param {boolean} value
   */
  setLineEnd(value) {
    this.lineEnd = value;
  }

  getKey() {
    return `${this.x}::${this.y}`;
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
    /** @type {Map.<string, Point>} */
    this.points = new Map();
    /** @type {Array.<string>} */
    this.drawOrder = [];
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
   * @param {boolean} lineEnd
   */
  addPoint(x, y, lineStart, lineEnd) {
    const point = new Point(
      x,
      y,
      this.strokeColour,
      this.fillColour,
      this.lineWidth,
      lineStart,
      lineEnd,
    );
    this.points.set(point.getKey(), point);
    this.drawOrder.push(point.getKey());
    this.renderPoint(point);
  }

  clearPoints() {
    this.points.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getLastPoint() {
    return this.points.get(this.drawOrder[this.drawOrder.length - 1]);
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
   * @param {string} colour
   */
  setStrokeColour(colour) {
    this.strokeColour = colour;
  }

  /**
   * @param {string} colour
   */
  setFillColour(colour) {
    this.fillColour = colour;
  }

  /**
   * @param {number} width
   */
  setLineWidth(width) {
    this.width = width;
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
    if (point.lineStart) {
      this.ctx.moveTo(point.x, point.y);
    }
    this.syncColours(point);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.stroke();
  }

  rerender() {
    for (let i = 0; i < this.points.size; i++) {
      const point = this.points.get(this.drawOrder[i]);
      if (!point) {
        console.log("point is undefined");
        continue;
      }
      this.renderPoint(point);
    }
  }
}
