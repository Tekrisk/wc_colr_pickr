import { hexAToRGBA, HSLAToRGBA } from '../utility/color-conversion';

const ColorChangeEvent = {
  _this: null,

  /**
   * @memberof WCColrPickr
   * @method colorChange
   * @description Function to change the color of the component
   * @param {string} color - The color you are changing the instance to
   * @param {HTMLElement} elem - The button HTMLElement that is a part of the instance
   *
   * @example
   * const button = document.getElementById('my_button');
   * this._this.colorChange('#ff0000', button);
   */
  colorChange: function (color) {
    let _color = color;

    // If the user send a string manually...
    if (typeof _color === 'string') {
      // Change it to the expected value of a HSLA object
      _color = hexAToRGBA(_color, true);
    }

    // Defining the RGBA value conversion
    const rgbaValue = HSLAToRGBA(_color.h, _color.s, _color.l, _color.a);
    const hex = HSLAToRGBA(_color.h, _color.s, _color.l, _color.a, true);

    /**
     * @event colorChange
     * @description Event to fire whenever the color picker is closed for new details on the color instance. Calling event.detail will return an object of the following:
     * @return {object} color - Object of color values
     * @return {string} color.hex - Hex value of chosen color
     * @return {string} color.rgb - RGB value of chosen color
     * @return {string} color.hsl - HSL value of chosen color
     * @return {string} color.hexa - HexAlpha value of chosen color
     * @return {string} color.rgba - RGBA value of chosen color
     * @return {string} color.hsla - HSLA value of chosen color
     */
    const event = new CustomEvent('colorChange', {
      // Adding the response details
      detail: {
        color: {
          hsl: `hsla(${_color.h}, ${_color.s}%, ${_color.l}%)`,
          rgb: `rgba(${rgbaValue.r}, ${rgbaValue.g}, ${rgbaValue.b})`,
          hex: hex,
          hsla: `hsla(${_color.h}, ${_color.s}%, ${_color.l}%, ${_color.a})`,
          rgba: `rgba(${rgbaValue.r}, ${rgbaValue.g}, ${rgbaValue.b}, ${rgbaValue.a})`,
          hexa: hex,
        },
      },
    });

    // Defining color
    // Changing color attributes
    this._this.button.setAttribute('data-color', hex);
    this._this.button.style.background = hex;

    // Dispatching the event for the active object
    this._this.shadowRoot.dispatchEvent(event);
  },
};

export default ColorChangeEvent;
