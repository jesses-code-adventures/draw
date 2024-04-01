//@ts-check
import { Colour } from "./colour.js";

/**
 * A point that will be drawn
 */
export class Point {
  /**
   * Creates a point
   * @param {number} x
   * @param {number} y
   * @param {Colour} lineColour
   * @param {Colour} fillColour
   * @param {number} lineWidth
   * @param {boolean} lineStart
   * @param {boolean} lineEnd
   * @param {boolean} fill
   */
  constructor(
    x,
    y,
    lineColour,
    fillColour,
    lineWidth,
    lineStart,
    lineEnd,
    fill,
  ) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {Colour} */
    this.strokeColour = lineColour;
    /** @type {Colour} */
    this.fillColour = fillColour;
    /** @type {number} */
    this.lineWidth = lineWidth;
    /** @type {boolean} */
    this.lineStart = lineStart;
    /** @type {boolean} */
    this.lineEnd = lineEnd;
    /** @type {boolean} */
    this.fill = fill;
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
   * @param {MediaQueryList} darkMode
   */
  constructor(ctx, canvas, darkMode) {
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
    /** @type {number} */
    this.lineWidth = 5;
    if (darkMode.matches) {
      console.log("yes dark mode");
      /** @type {Colour} */
      this.strokeColour = new Colour(0, 100, 100, 1);
      /** @type {Colour} */
      this.fillColour = new Colour(0, 100, 100, 1);
    } else {
      console.log("no dark mode");
      /** @type {Colour} */
      this.strokeColour = new Colour(360, 1, 1, 1);
      /** @type {Colour} */
      this.fillColour = new Colour(360, 1, 1, 1);
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
   * @param {boolean} fill
   */
  addPoint(x, y, lineStart, lineEnd, fill) {
    const point = new Point(
      x,
      y,
      new Colour(
        this.strokeColour.hue,
        this.strokeColour.saturation,
        this.strokeColour.lightness,
        this.strokeColour.alpha,
      ),
      new Colour(
        this.fillColour.hue,
        this.fillColour.saturation,
        this.fillColour.lightness,
        this.fillColour.alpha,
      ),
      this.lineWidth,
      lineStart,
      lineEnd,
      fill,
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
   * @param {Colour} colour
   */
  setStrokeColour(colour) {
    this.strokeColour = colour;
    this.ctx.strokeStyle = this.strokeColour.getHslaString();
  }

  /**
   * @param {Colour} colour
   */
  setFillColour(colour) {
    this.fillColour = colour;
    this.ctx.fillStyle = this.fillColour.getHslaString();
  }

  /**
   * @param {number} width
   */
  setLineWidth(width) {
    this.lineWidth = width;
    this.ctx.lineWidth = this.lineWidth;
  }

  /**
   * @param {Point} point
   * @private
   */
  syncColoursWithPoint(point) {
    if (this.ctx.strokeStyle !== point.strokeColour.getHslaString()) {
      this.ctx.strokeStyle = point.strokeColour.getHslaString();
    }
    if (this.ctx.fillStyle !== point.fillColour.getHslaString()) {
      this.ctx.fillStyle = point.fillColour.getHslaString();
    }
    if (this.ctx.lineWidth !== point.lineWidth) {
      this.ctx.lineWidth = point.lineWidth;
    }
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
    if (point.fill) {
      this.renderFill();
      return;
    }
    if (point.lineStart) {
      this.ctx.beginPath();
    }
    this.ctx.lineTo(point.x, point.y);
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.stroke();
    if (point.lineEnd) {
      this.ctx.closePath();
    }
  }

  /**
   * @private
   */
  renderFill() {
    this.ctx.fill("evenodd");
  }

  rerender() {
    for (let i = 0; i < this.points.size; i++) {
      const point = this.points.get(this.drawOrder[i]);
      if (!point) {
        continue;
      }
      this.syncColoursWithPoint(point);
      this.renderPoint(point);
    }
  }
}

export class WindowSize {
  constructor() {
    /** @type {number} */
    this.height = window.outerHeight;
    /** @type {number} */
    this.width = window.outerWidth;
    /** @type {number} */
    this.innerHeight = window.innerHeight;
    /** @type {number} */
    this.innerWidth = window.innerWidth;
  }

  /**
   * Handle the resize event
   * @param {DrawState} drawState
   */
  resize(drawState) {
    this.height = window.outerHeight;
    this.width = window.outerWidth;
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    drawState.canvas.width = this.innerWidth;
    drawState.canvas.height = this.innerHeight;
    drawState.canvas.style.width = this.innerWidth + "px";
    drawState.canvas.style.height = this.innerHeight + "px";
    const scale =
      window.devicePixelRatio ||
      window.screen.availWidth / document.documentElement.clientWidth;
    drawState.canvas.width *= scale;
    drawState.canvas.height *= scale;
    drawState.ctx.scale(scale, scale);
    drawState.rerender();
  }
}
