//@ts-check

import { WindowSize, DrawState } from "./core.js";
import { ColourSelector } from "./colourSelector.js";

document.addEventListener("DOMContentLoaded", () => {
  new App();
});

class App {
  constructor() {
    /** @type {MediaQueryList} */
    this.darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const app = document.querySelector("#app");
    if (!app) {
      throw new Error("app not found");
    }
    app.innerHTML = `
    <canvas id="drawArea" class="h-full w-full overflow-hidden"></canvas>
    <div id="controls" class="absolute left-2 top-2"></div>
  `;
    this.canvas = document.querySelector("#drawArea");
    if (!(this.canvas instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element not found");
    }
    // @type {CanvasRenderingContext2D}
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error("ctx not found");
    }
    this.windowSize = new WindowSize();
    this.drawState = new DrawState(this.ctx, this.canvas, this.darkMode);
    this.windowSize.resize(this.drawState);
    this.addListeners();
    this.render_controls();
  }

  /**
   * set up the interactivity
   * call when the dom content is loaded
   * @private
   */
  addListeners() {
    if (!window.visualViewport) {
      throw new Error("visualViewport not found");
    }
    // @type {HTMLCanvasElement}
    window.visualViewport.addEventListener(
      "resize",
      () => {
        this.windowSize.resize(this.drawState);
      },
      false,
    );
    // Drawing events
    document.addEventListener("mousedown", (e) => {
      if (!e.target) {
        return;
      }
      if (!(e.target instanceof HTMLElement)) {
        console.log("Not an html element");
        return;
      }
      if (e.button === 2 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
        if (!(e.target instanceof HTMLElement)) {
          console.log("Not an html element");
          return;
        }
        if (e.target.id === "drawArea") {
          this.drawState.addPoint(e.x, e.y, false, false, true);
        }
        return;
      }
      if (e.target.id === "drawArea") {
        this.drawState.setIsDrawing(true);
        this.drawState.addPoint(e.x, e.y, true, false, false);
      }
      if (e.target.id === "clearPoints") {
        this.drawState.clearPoints();
      }
    });
    document.addEventListener("mouseup", () => {
      if (this.drawState.isDrawing) {
        const lastPoint = this.drawState.getLastPoint();
        if (lastPoint) {
          lastPoint.setLineEnd(true);
        }
        this.drawState.setIsDrawing(false);
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (this.drawState.isDrawing) {
        this.drawState.addPoint(e.x, e.y, false, false, false);
      }
    });
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  /**
   * Set up the controls
   * @private
   * @throws {Error} controls not found
   */
  render_controls() {
    const controls = document.querySelector("#controls");
    if (!controls) {
      throw new Error("controls not found");
    }
    document.addEventListener("click", (e) => {
      if (!e.target) {
        return;
      }
      if (!(e.target instanceof HTMLElement)) {
        return;
      }
      console.log(e.target.id);
      if (e.target.id === "strokeButtonAndSelector-colourSelectorButton") {
        strokeColourSelector.setVisibility(!strokeColourSelector.visible);
      }
      if (e.target.id === "fillButtonAndSelector-colourSelectorButton") {
        fillColourSelector.setVisibility(!fillColourSelector.visible);
      }
    });
    controls.innerHTML = `
  <div class="grid grid-cols-2 w-24 gap-4">
    <img id="clearPoints" src="clean_dark.png" alt="clear" class="w-8 h-8 text-white dark:bg-white invert " />
    <div id="strokeButtonAndSelector" class="flex flex-row w-full "></div>
    <div id="placeholder" class="">hi</div>
    <div id="fillButtonAndSelector" class="flex flex-row w-full "></div>
  </div>
    `;
    const strokeColourSelector = new ColourSelector(
      "strokeButtonAndSelector",
      (colour) => this.drawState.setStrokeColour(colour),
      "stroke_colour_dark.png",
    );
    const fillColourSelector = new ColourSelector(
      "fillButtonAndSelector",
      (colour) => this.drawState.setFillColour(colour),
      "fill_colour_dark.png",
    );
    strokeColourSelector.render();
    fillColourSelector.render();
  }
}
