import { DrawState } from "./core.js";

const drawState = new DrawState();

class WindowSize {
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
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  resize(canvas, ctx) {
    this.height = window.outerHeight;
    this.width = window.outerWidth;
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    canvas.width = this.innerWidth;
    canvas.height = this.innerHeight;
    canvas.style.width = this.innerWidth + "px";
    canvas.style.height = this.innerHeight + "px";
    const scale =
      window.devicePixelRatio ||
      window.screen.availWidth / document.documentElement.clientWidth;
    canvas.width *= scale;
    canvas.height *= scale;
    ctx.scale(scale, scale);
    drawState.rerender(ctx);
  }
}

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
  const windowSize = new WindowSize();
  windowSize.resize(canvas, ctx);
  window.visualViewport.addEventListener(
    "resize",
    () => {
      console.log("you're resizing");
      windowSize.resize(canvas, ctx);
    },
    false,
  );

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
  <canvas id="drawArea" class="h-full w-full overflow-hidden"></canvas>
  <div id="controls" class="absolute left-2 top-2"></div>
`;

document.querySelector("#controls").innerHTML = `
  <button id="clearPoints">clear</button>
`;
