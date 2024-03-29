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
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Point} point
   */
  renderPoint(ctx, point) {
    if (!ctx) {
      console.log("ctx is undefined");
      return;
    }
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
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
    }
    if (e.target.id === "clearPoints") {
      drawState.clearPoints();
    }
  });

  document.addEventListener("mouseup", () => {
    drawState.setIsDrawing(false);
  });

  document.addEventListener("mousemove", (e) => {
    if (drawState.isDrawing) {
      const point = drawState.addPoint(e.x, e.y);
      drawState.renderPoint(ctx, point);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
});

document.querySelector("#app").innerHTML = `
  <canvas id="drawArea" class="bg-red-200 h-full w-full"></canvas>
  <div id="controls" class="absolute left-2 top-2"></div>
`;

document.querySelector("#controls").innerHTML = `
  <button id="clearPoints">clear</button>
`;
