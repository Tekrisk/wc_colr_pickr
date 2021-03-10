import { hexAToRGBA, RGBAToHSLA, HSLAToRGBA } from '../utility/color-conversion';

export class UpdatePicker {
  constructor(_component) {
    this._component = _component;
    this.updateColorDisplays = this.updateColorDisplays.bind(this);
    this.updateColorValueInput = this.updateColorValueInput.bind(this);
  }

  // Function to update color displays
  updateColorDisplays(color) {
    let uColor = color;

    // Checking if color picker has not been set
    if (!uColor) {
      // Setting the default color positioning of the player to red
      uColor = {
        h: 0,
        s: 100,
        l: 50,
        a: 1,
      };
    } else {
      // Checking the color type that has been given
      if (uColor.substring(0, 1) === '#') {
        // Converting the color to HSLA
        uColor = hexAToRGBA(uColor, true);
      } else if (uColor.match(/rgba?/)) {
        // Extracting the values
        const rgb = uColor.match(/[.?\d]+/g);

        // Making sure there is a alpha value
        rgb[3] = rgb[3] === undefined ? 1 : rgb[3];

        // Converting the color to HSLA
        uColor = RGBAToHSLA(rgb[0], rgb[1], rgb[2], rgb[3]);
      } else {
        // Extracting the values
        const hsl = uColor.match(/[.?\d]+/g);

        if (hsl) { // undefined if we have no color yet
          // Making sure there is a alpha value
          hsl[3] = hsl[3] === undefined ? 1 : hsl[3];

          // Formatting the value properly
          uColor = {
            h: hsl[0],
            s: hsl[1],
            l: hsl[2],
            a: hsl[3],
          };
        } else { // try to get color from text
          let a = document.createElement('div');
          a.style.color = uColor;
          let colors = window.getComputedStyle(this._component.shadowRoot.appendChild(a) ).color.match(/\d+/g).map((a) => parseInt(a,10));
          this._component.shadowRoot.removeChild(a);
          if (colors.length >= 3) {
            uColor = '#' + ((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1);
            uColor = hexAToRGBA(uColor, true);
          }
        }
      }
    }

    // Updating the data object
    this._component.hue = uColor.h;
    this._component.saturation = uColor.s;
    this._component.lightness = uColor.l;
    this._component.alpha = uColor.a;

    // Updating the input values
    this.updateColorValueInput();

    // Calculating x value
    let x = (238 / 100) * uColor.s + 14;

    // Calculating y value
    const percentY = 100 - (uColor.l / (100 - uColor.s / 2)) * 100;
    let y = (105 / 100) * percentY + 14;

    // Making conditions so that the user don't drag outside the box
    if (x < 14) x = 14;

    if (x > 252) x = 252;

    if (y < 14) y = 14;

    if (y > 119) y = 119;

    // Making changes the the UI
    this._component.boxX = x;
    this._component.boxY = y;

    // Calculating x value
    this._component.hueX = (244 / 100) * (100 - (uColor.h / 359) * 100) + 11;

    // Calculating x value
    this._component.alphaX = (244 / 100) * (uColor.a * 100) + 11;
  }

  // Update the color value inputs
  updateColorValueInput() {
    // Checking the value color type the user has selected
    if (this._component.colorTypeStatus === 'HEXA') {
      // Converting the value
      const hexValue = HSLAToRGBA(this._component.hue, this._component.saturation, this._component.lightness, this._component.alpha, true);

      // Applying the value to the input
      this._component.shadowRoot.getElementById('hex_input').value = hexValue;
    } else if (this._component.colorTypeStatus === 'RGBA') {
      // Converting the value
      const RGBAValue = HSLAToRGBA(this._component.hue, this._component.saturation, this._component.lightness, this._component.alpha);

      // Applying the value to the inputs
      this._component.shadowRoot.querySelectorAll('.rgba_input')[0].value = RGBAValue.r;
      this._component.shadowRoot.querySelectorAll('.rgba_input')[1].value = RGBAValue.g;
      this._component.shadowRoot.querySelectorAll('.rgba_input')[2].value = RGBAValue.b;
      this._component.shadowRoot.querySelectorAll('.rgba_input')[3].value = RGBAValue.a;
    } else {
      // Applying the value to the inputs
      this._component.shadowRoot.querySelectorAll('.hsla_input')[0].value = this._component.hue;
      this._component.shadowRoot.querySelectorAll('.hsla_input')[1].value = this._component.saturation;
      this._component.shadowRoot.querySelectorAll('.hsla_input')[2].value = this._component.lightness;
      this._component.shadowRoot.querySelectorAll('.hsla_input')[3].value = this._component.alpha;
    }
  }
}