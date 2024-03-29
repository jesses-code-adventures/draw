/**
 * A point that will be drawn
 */
class Point {
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
class DrawState {
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
}

const drawState = new DrawState();

/**
 * set up the interactivity
 * call when the dom content is loaded
 */
function initialize() {
  // @type {HTMLCanvasElement}
  const canvas = document.querySelector("#drawArea");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas element not found");
  }
  // @type {CanvasRenderingContext2D}
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("ctx not found");
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  const scale = window.devicePixelRatio;
  canvas.width *= scale;
  canvas.height *= scale;
  ctx.scale(scale, scale);

  // Drawing events
  document.addEventListener("mousedown", (e) => {
    if (e.target.id === "drawArea") {
      drawState.setIsDrawing(true);
      ctx.beginPath();
    }
    if (e.target.id === "clearPoints") {
      drawState.clearPoints();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  document.addEventListener("mouseup", () => {
    drawState.setIsDrawing(false);
    ctx.closePath();
  });

  document.addEventListener("mousemove", (e) => {
    if (drawState.isDrawing) {
      const point = drawState.addPoint(e.x, e.y);
      drawState.renderPoint(ctx, point);
      drawState.setCurrentPoint(point);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
});

document.querySelector("#app").innerHTML = `
  <canvas id="drawArea" class="h-full w-full"></canvas>
  <div id="controls" class="absolute left-2 top-2"></div>
`;

document.querySelector("#controls").innerHTML = `
  <button id="clearPoints">clear</button>
`;
