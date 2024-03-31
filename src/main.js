//@ts-check

import { DrawState } from "./core.js";

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

/**
 * set up the interactivity
 * call when the dom content is loaded
 * @private
 */
function attach() {
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
  const drawState = new DrawState(ctx, canvas);
  windowSize.resize(drawState);
  if (!window.visualViewport) {
    throw new Error("visualViewport not found");
  }
  window.visualViewport.addEventListener(
    "resize",
    () => {
      windowSize.resize(drawState);
    },
    false,
  );
  // Drawing events
  document.addEventListener("mousedown", (e) => {
    if (!e.target) {
      return;
    }
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    if (e.target.id === "drawArea") {
      drawState.setIsDrawing(true);
      drawState.addPoint(e.x, e.y, true, false);
    }
    if (e.target.id === "clearPoints") {
      drawState.clearPoints();
    }
  });
  document.addEventListener("mouseup", (e) => {
    if (drawState.isDrawing) {
      drawState.addPoint(e.x, e.y, false, true);
      drawState.setIsDrawing(false);
    }
  });
  document.addEventListener("mousemove", (e) => {
    if (drawState.isDrawing) {
      drawState.addPoint(e.x, e.y, false, false);
    }
  });
}

/**
 * Set up the app
 * @private
 * @throws {Error} app not found
 */
function app() {
  const app = document.querySelector("#app");
  if (!app) {
    throw new Error("app not found");
  }
  app.innerHTML = `
    <canvas id="drawArea" class="h-full w-full overflow-hidden"></canvas>
    <div id="controls" class="absolute left-2 top-2"></div>
  `;
  controls();
}

/**
 * Set up the controls
 * @private
 * @throws {Error} controls not found
 */
function controls() {
  const controls = document.querySelector("#controls");
  if (!controls) {
    throw new Error("controls not found");
  }
  controls.innerHTML = `
  <div class="grid grid-cols-2 gap-2">
    <button id="clearPoints">clear</button>
  </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  app();
  attach();
});
