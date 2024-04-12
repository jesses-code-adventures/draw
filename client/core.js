//@ts-check
import { Colour, copyColour } from "./colour.js";

/**
 * Draw state component defining the drawing method
 */
export class LineType {
  /** @param {'straight' | 'free'} type */
  constructor(type) {
    /** @type {'straight' | 'free'} */
    this.type = type;
  }
}

// * @param {Colour} lineColour
// * @param {Colour} fillColour
/**
 * A point that will be drawn
 */
export class Point {
  /**
   * Creates a point
   * @param {number} x
   * @param {number} y
   * @param {number} lineWidth
   * @param {boolean} lineStart
   * @param {boolean} lineEnd
   * @param {boolean} fill
   * @param {Colour | null} fillColour
   */
  constructor(x, y, lineWidth, lineStart, lineEnd, fill, fillColour) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    // /** @type {Colour} */
    // this.strokeColour = lineColour;
    // /** @type {Colour} */
    // this.fillColour = fillColour;
    /** @type {number} */
    this.lineWidth = lineWidth;
    /** @type {boolean} */
    this.lineStart = lineStart;
    /** @type {boolean} */
    this.lineEnd = lineEnd;
    /** @type {boolean} */
    this.fill = fill;
    /** @type {Colour | null} */
    this.fillColour = fillColour;
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
 * A line.
 */
export class Line {
  /**
   * Creates a line
   * @param {Point} start
   * @param {LineType} type
   * @param {Colour} colour
   * @param {number} width
   */
  constructor(start, type, colour, width) {
    /** @type {Point} @private */
    this.start = start;
    /** @type {LineType} @private */
    this.type = type;
    /** @type {Point} @private */
    this.end = this.start;
    /** @type {number} @private */
    this.width = width;
    /** @type {Colour} */
    this.colour = colour;
    /** @type {Array.<Point>} @private */
    this.points = [];
    /** @type {boolean} */
    this.locked = false;
    if (this.type.type === "free") {
      this.points.push(start);
    }
  }

  /**
   * @param {Point} point
   */
  setEnd(point) {
    if (this.locked) {
      throw new Error("Line must not be locked to edit end");
    }
    this.end = point;
  }

  /**
   * @param {Point} point
   */
  pushPoint(point) {
    if (this.type.type === "straight") {
      this.handleStraightDrawPoint(point);
    }
    if (this.type.type === "free") {
      this.handleFreeDrawPoint(point);
    }
  }

  /**
   * @returns string
   */
  getKey() {
    if (!this.locked) {
      throw new Error("Line must be locked to get a key");
    }
    return `${this.start.x}::${this.start.y}::${this.end.x}::${this.end.y}`;
  }

  /**
   * @returns LineType
   */
  getType() {
    return this.type;
  }

  /**
   * @returns Point
   */
  getStart() {
    return this.start;
  }

  /**
   * @returns Point
   */
  getEnd() {
    return this.end;
  }

  /**
   * @returns number
   */
  getWidth() {
    return this.width;
  }

  /**
   * @returns Array.<Point>
   */
  getFreeDrawPoints() {
    if (this.type.type === "straight") {
      throw new Error("cannot draw free draw points with a straight line");
    }
    return this.points;
  }

  /**
   * @param {Point} point
   * @private
   */
  handleFreeDrawPoint(point) {
    if (this.type.type === "straight") {
      throw new Error("Cannot push a free draw point to a straight line");
    }
    this.points.push(point);
    if (point.lineEnd) {
      this.setEnd(point);
      this.locked = true;
    }
  }

  /**
   * @param {Point} point
   * @private
   */
  handleStraightDrawPoint(point) {
    if (this.type.type === "free") {
      throw new Error("Cannot push a straight draw point to a free line");
    }
    console.log(this.points.length);
    if (point.lineStart) {
      this.start = point;
    }
    if (point.lineEnd) {
      this.end = point;
    }
  }
}

/**
 * Contains the draw state and a render function
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
    /** @type {Map.<string, Point | Line>} */
    this.drawItems = new Map();
    /** @type {Array.<string>} */
    this.drawOrder = [];
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @type {number} */
    this.currentLineWidth = 5;
    if (darkMode.matches) {
      /** @type {Colour} */
      this.strokeColour = new Colour(0, 100, 100, 1);
      /** @type {Colour} */
      this.fillColour = new Colour(0, 100, 100, 1);
    } else {
      /** @type {Colour} */
      this.strokeColour = new Colour(360, 1, 1, 1);
      /** @type {Colour} */
      this.fillColour = new Colour(360, 1, 1, 1);
    }
    /** @type {Colour} */
    this.setStrokeColour(this.strokeColour);
    /** @type {Colour} */
    this.setFillColour(this.fillColour);
    //** @type {boolean} */
    this.currentLineType = new LineType("free");
    /** @type {Line | null} */
    this.currentLine = null;
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

  // /**
  //  * Add a point to the DrawState
  //  * @param {number} x
  //  * @param {number} y
  //  * @param {boolean} lineStart
  //  * @param {boolean} lineEnd
  //  * @param {boolean} fill
  //  * @private
  //  */
  // handleFreeDrawPoint(x, y, lineStart, lineEnd, fill) {}

  // handleStraightDrawPoint(x, y, lineStart, lineEnd, fill) {
  //   if (this.currentLineType.type === "straight" && lineStart) {
  //     // add the start point
  //   }
  //   if (this.currentLineType.type === "straight" && lineEnd) {
  //     // add the end point
  //   }
  // }
  //

  /**
   * @param {Point} point
   */
  addFillPoint(point) {
    this.drawItems.set(point.getKey(), point);
    this.drawOrder.push(point.getKey());
    this.syncColoursWithPointInRerender(point);
    this.renderPoint(point);
    return;
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
    const lineColour = copyColour(this.strokeColour);
    var fillColour = null;
    if (fill) {
      fillColour = copyColour(this.fillColour);
    }
    const point = new Point(
      x,
      y,
      this.currentLineWidth,
      lineStart,
      lineEnd,
      fill,
      fillColour,
    );
    if (point.fill) {
      this.addFillPoint(point);
      return;
    }
    if (!this.currentLine && !lineStart) {
      throw new Error("Cannot add a non fill point without a line");
    }
    if (!this.currentLine) {
      if (!lineStart) {
        throw new Error("should be a line start to construct a new line");
      }
      this.currentLine = new Line(
        point,
        this.currentLineType,
        lineColour,
        this.currentLineWidth,
      );
      this.syncColoursWithLineInRerender(this.currentLine);
      this.renderLine(this.currentLine);
      return;
    }
    this.currentLine.pushPoint(point);
    if (point.lineEnd && this.currentLine.getType().type === "straight") {
      this.currentLine.locked = true;
      const lineKey = this.currentLine.getKey();
      this.drawItems.set(lineKey, this.currentLine);
      this.drawOrder.push(lineKey);
      this.syncColoursWithLineInRerender(this.currentLine);
      this.renderLine(this.currentLine);
      this.currentLine = null;
      return;
    }
    if (point.lineEnd) {
      this.currentLine.locked = true;
      const lineKey = this.currentLine.getKey();
      this.drawItems.set(lineKey, this.currentLine);
      this.drawOrder.push(lineKey);
      this.syncColoursWithLineInRerender(this.currentLine);
      this.currentLine = null;
      return;
    }
    this.syncColoursWithLineInRerender(this.currentLine);
    this.renderLine(this.currentLine);
    if (point.lineEnd) {
      this.currentLine = null;
    }
  }

  clearPoints() {
    this.drawItems.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getLastPoint() {
    return this.drawItems.get(this.drawOrder[this.drawOrder.length - 1]);
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
    this.currentLineWidth = width;
    this.ctx.lineWidth = this.currentLineWidth;
  }

  /**
   * @param {LineType} mode
   */
  setLineMode(mode) {
    this.currentLineType = mode;
  }

  /**
   * @param {Line} line
   * @private
   */
  syncColoursWithLineInRerender(line) {
    if (this.ctx.strokeStyle !== line.colour.getHslaString()) {
      this.ctx.strokeStyle = line.colour.getHslaString();
    }
    if (this.ctx.lineWidth !== line.getWidth()) {
      this.ctx.lineWidth = line.getWidth();
    }
  }

  /**
   * @param {Point} point
   * @private
   */
  syncColoursWithPointInRerender(point) {
    if (!point.fillColour) {
      return;
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
    if (!point.lineStart) {
      this.ctx.stroke();
    }
    if (point.lineEnd) {
      this.ctx.closePath();
    }
  }

  /**
   * @param {Line} line
   * @private
   */
  renderLine(line) {
    if (!this.ctx) {
      throw new Error("ctx is undefined");
    }
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    const start = line.getStart();
    const end = line.getEnd();
    this.ctx.moveTo(start.x, start.y);
    if (line.getType().type === "straight") {
      if (!end) {
        throw new Error("line should be ended");
      }
      if (start.x !== end.x || start.y !== end.y) {
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
      return;
    }
    const points = line.getFreeDrawPoints();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.ctx.lineTo(point.x, point.y);
      this.ctx.stroke();
      if (point.lineEnd) {
        this.ctx.closePath();
        break;
      }
    }
  }

  /**
   * @private
   */
  renderFill() {
    this.ctx.fill("evenodd");
  }

  rerender() {
    for (let i = 0; i < this.drawItems.size; i++) {
      const item = this.drawItems.get(this.drawOrder[i]);
      if (!item) {
        console.log("no item found");
        continue;
      }
      if (item instanceof Point) {
        this.syncColoursWithPointInRerender(item);
        this.renderPoint(item);
        continue;
      }
      if (item instanceof Line) {
        this.syncColoursWithLineInRerender(item);
        this.renderLine(item);
      }
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
