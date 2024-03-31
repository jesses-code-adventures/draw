// @ts-check
import { Colour } from "./colour.js";

/**
 * @callback setColourCallback
 * @param {Colour} colour
 */

export class ColourSelector {
  /**
   * @param {string} parent
   * @param {setColourCallback} setColour
   * @param {string} iconLocation
   */
  constructor(parent, setColour, iconLocation) {
    /** @type {string} */
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
    this.visible = false;
    /** @type {Colour} */
    this.colour = new Colour(
      this.selectedHue,
      this.selectedSaturation,
      this.selectedLightness,
      this.selectedAlpha,
    );
    /** @type {function(Colour):void} */
    // @ts-expect-error
    this.setColour = setColour;
    /** @type {string} */
    this.iconLocation = iconLocation;
  }

  /**
   * @param {number} hue
   */
  setHue(hue) {
    this.selectedHue = hue;
    this.colour.setHue(hue);
    // @ts-expect-error
    this.setColour(this.colour);
    this.renderColourDisplay();
  }

  /**
   * @param {number} saturation
   */
  setSaturation(saturation) {
    this.selectedSaturation = saturation;
    this.colour.setSaturation(saturation);
    // @ts-expect-error
    this.setColour(this.colour);
    this.renderColourDisplay();
  }

  /**
   * @param {number} lightness
   */
  setLightness(lightness) {
    this.selectedLightness = lightness;
    this.colour.setLightness(lightness);
    // @ts-expect-error
    this.setColour(this.colour);
    this.renderColourDisplay();
  }

  /**
   * @param {number} alpha
   */
  setAlpha(alpha) {
    this.selectedAlpha = alpha;
    this.colour.setAlpha(alpha);
    // @ts-expect-error
    this.setColour(this.colour);
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
    } else {
      console.log("Hue not found");
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
    const displayId = this.getColourDisplayId();
    this.colour.render(displayId).outerHTML;
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
    const ids = this.getIds();
    const selectorContainer = document.createElement("div");
    selectorContainer.id = `${this.elementName}-selectorContainer`;
    selectorContainer.innerHTML = `
    <div id="colourSelectorContainer" class="flex flex-col border-0 dark:bg-zinc-800 dark:border-white border-black p-1 relative items-center" >
        <div id="sliderContainer" class="flex flex-col items-center text-center">
          <label for="${ids.hueId}">Hue</label>
          <input class="w-3/8" type="range" id="${ids.hueId}" min="0" max="360" value="${this.selectedHue}" />
          <label for="${ids.saturationId}">Saturation</label>
          <input class="w-3/8" type="range" id="${ids.saturationId}" min="0" max="100" value="${this.selectedSaturation}" />
          <label for="${ids.lightnessId}">Lightness</label>
          <input class="w-3/8" type="range" id="${ids.lightnessId}" min="0" max="100" value="${this.selectedLightness}" />
          <label for="${ids.alphaId}">Alpha</label>
          <input class="w-3/8" type="range" id="${ids.alphaId}" min="0" max="1" step="0.01" value="${this.selectedAlpha}" />
        </div>
        <div id="${ids.colourDisplay}" class="border-2 border-red-300 h-12 w-1/2 rounded-full">
        </div>
      </div>
    `;
    if (!this.visible) {
      selectorContainer.hidden = true;
    } else {
      selectorContainer.hidden = false;
    }
    element.innerHTML = `
      <img id="showStrokeColourSelector" src="${this.iconLocation}" class="w-8 h-8 text-white dark:bg-white invert" />
      ${selectorContainer.outerHTML}
    `;
    this.addListeners(); // Has to go here so that the preceding elements have been renderered already
    this.renderColourDisplay();
  }
}
