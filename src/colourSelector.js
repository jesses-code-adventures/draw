// @ts-check
import { Colour } from "./colour.js";

export class ColourSelector {
  /**
   * @param {string} parent
   */
  constructor(parent) {
    /** @type {parent} */
    this.elementName = parent;
    /** @type {number} */
    this.selectedHue = 180;
    /** @type {number} */
    this.selectedSaturation = 50;
    /** @type {number} */
    this.selectedLightness = 50;
    /** @type {number} */
    this.selectedAlpha = 1;
    /** @type{boolean} */
    this.visible = true;
    /** @type {Colour} */
    this.colour = new Colour(
      this.selectedHue,
      this.selectedSaturation,
      this.selectedLightness,
      this.selectedAlpha,
    );
  }

  /**
   * @param {number} hue
   */
  setHue(hue) {
    this.selectedHue = hue;
    this.colour.setHue(hue);
    this.renderColourDisplay();
  }

  /**
   * @param {number} saturation
   */
  setSaturation(saturation) {
    this.selectedSaturation = saturation;
    this.colour.setSaturation(saturation);
    this.renderColourDisplay();
  }

  /**
   * @param {number} lightness
   */
  setLightness(lightness) {
    this.selectedLightness = lightness;
    this.colour.setLightness(lightness);
    this.renderColourDisplay();
  }

  /**
   * @param {number} alpha
   */
  setAlpha(alpha) {
    this.selectedAlpha = alpha;
    this.colour.setAlpha(alpha);
    this.renderColourDisplay();
  }

  /**
   * @param {boolean} value
   */
  setVisibility(value) {
    this.visible = value;
    this.render();
  }

  setColour() {
    this.colour.setHue(this.selectedHue);
    this.colour.setSaturation(this.selectedSaturation);
    this.colour.setLightness(this.selectedLightness);
    this.colour.setAlpha(this.selectedAlpha);
  }

  /**
   * @returns {{hueId: string, saturationId: string, lightnessId: string, alphaId: string, colourDisplay: string}}
   */
  getIds() {
    const hueId = `${this.elementName}-hue`;
    const saturationId = `${this.elementName}-saturation`;
    const lightnessId = `${this.elementName}-lightness`;
    const alphaId = `${this.elementName}-alpha`;
    const colourDisplay = this.getColourDisplayId();
    return { hueId, saturationId, lightnessId, alphaId, colourDisplay };
  }

  addListeners() {
    const inputIds = this.getIds();
    const hue = document.querySelector(`#${inputIds.hueId}`);
    if (hue) {
      hue.addEventListener("input", (event) => {
        if (!event) {
          console.log("No event");
          return;
        }
        if (!(event.target instanceof HTMLInputElement)) {
          console.log("Not an input element");
          return;
        }
        this.setHue(Number(event.target.value));
      });
    }
    const saturation = document.querySelector(`#${inputIds.saturationId}`);
    if (saturation) {
      saturation.addEventListener("input", (event) => {
        if (!event) {
          console.log("No event");
          return;
        }
        if (!(event.target instanceof HTMLInputElement)) {
          console.log("Not an input element");
          return;
        }
        this.setSaturation(Number(event.target.value));
      });
    }
    const lightness = document.querySelector(`#${inputIds.lightnessId}`);
    if (lightness) {
      lightness.addEventListener("input", (event) => {
        if (!event) {
          console.log("No event");
          return;
        }
        if (!(event.target instanceof HTMLInputElement)) {
          console.log("Not an input element");
          return;
        }
        this.setLightness(Number(event.target.value));
      });
    }
    const alpha = document.querySelector(`#${inputIds.alphaId}`);
    if (alpha) {
      alpha.addEventListener("input", (event) => {
        if (!event) {
          console.log("No event");
          return;
        }
        if (!(event.target instanceof HTMLInputElement)) {
          console.log("Not an input element");
          return;
        }
        this.setAlpha(Number(event.target.value));
      });
    }
  }

  /**
   * @returns {Colour}
   */
  getColour() {
    return this.colour;
  }

  renderColourDisplay() {
    this.colour.render(this.getColourDisplayId()).outerHTML;
  }

  getColourDisplayId() {
    return `${this.elementName}-colourDisplay`;
  }

  /**
   * Function to render the selector
   */
  render() {
    const element = document.querySelector(`#${this.elementName}`);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Element not found ${this.elementName}`);
    }
    if (!this.visible) {
      element.hidden = true;
    } else {
      element.hidden = false;
    }
    const ids = this.getIds();
    element.innerHTML = `
    <div id="colourSelectorContainer" class="flex flex-col w-full border-2 dark:border-white border-black p-2 absolute" >
        <div id="sliderContainer" class="flex flex-col w-full items-center text-center">
          <label for="${ids.hueId}">Hue</label>
          <input type="range" id="${ids.hueId}" min="0" max="360" value="${this.selectedHue}" />
          <label for="${ids.saturationId}">Saturation</label>
          <input type="range" id="${ids.saturationId}" min="0" max="100" value="${this.selectedSaturation}" />
          <label for="${ids.lightnessId}">Lightness</label>
          <input type="range" id="${ids.lightnessId}" min="0" max="100" value="${this.selectedLightness}" />
          <label for="${ids.alphaId}">Alpha</label>
          <input type="range" id="${ids.alphaId}" min="0" max="1" step="0.01" value="${this.selectedAlpha}" />
        </div>
        <div id="${ids.colourDisplay}" class="border-2 border-red-300 h-12">
        </div>
      </div>
    `;
    this.renderColourDisplay();
    this.addListeners();
  }
}
