/**
 * Represents a single colour and has a render function  that returns a html element filled with the colour
 * The parent should provide a container for the colour so its size doesn't need to be set here
 */
export class Colour {
  /**
   * Creates a colour
   * @param {number} hue - 0-360
   * @param {number} saturation - 0-100
   * @param {number} lightness - 0-100
   * @param {number} alpha - 0-1
   */
  constructor(hue, saturation, lightness, alpha) {
    /** @type {number} */
    this.hue = hue;
    /** @type {number} */
    this.saturation = saturation;
    /** @type {number} */
    this.lightness = lightness;
    /** @type {number} */
    this.alpha = alpha;
  }

  /**
   * @param {number} hue
   */
  setHue(hue) {
    if (hue < 0 || hue > 360) {
      throw new Error("Hue must be between 0 and 360");
    }
    this.hue = hue;
  }

  /**
   * @param {number} saturation
   */
  setSaturation(saturation) {
    if (saturation < 0 || saturation > 100) {
      throw new Error("Saturation must be between 0 and 100");
    }
    this.saturation = saturation;
  }

  /**
   * @param {number} lightness
   */
  setLightness(lightness) {
    if (lightness < 0 || lightness > 100) {
      throw new Error("Lightness must be between 0 and 100");
    }
    this.lightness = lightness;
  }

  /**
   * @param {number} alpha
   */
  setAlpha(alpha) {
    if (alpha < 0 || alpha > 1) {
      throw new Error("Alpha must be between 0 and 1");
    }
    this.alpha = alpha;
  }

  /**
   * @returns {string}
   */
  getHslString() {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }

  /**
   * @returns {string}
   */
  getHslaString() {
    return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
  }

  /**
   * @param {string} elementName
   * @returns {HTMLElement}
   */
  render(elementName) {
    const element = document.getElementById(elementName);
    element.style.backgroundColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
    return element;
  }
}
