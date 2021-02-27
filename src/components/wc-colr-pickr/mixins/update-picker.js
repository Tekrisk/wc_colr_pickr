import { hexAToRGBA, RGBAToHSLA, HSLAToRGBA } from '../utility/color-conversion';

const UpdatePicker = {
  _this: null,

  // Function to update color displays
  updateColorDisplays: function(color) {
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
      } else if (uColor.substring(0, 1) === 'r') {
        // Extracting the values
        const rgb = uColor.match(/[.?\d]+/g);

        // Making sure there is a alpha value
        rgb[3] = rgb[3] === undefined ? 1 : rgb[3];

        // Converting the color to HSLA
        uColor = RGBAToHSLA(rgb[0], rgb[1], rgb[2], rgb[3]);
      } else {
        // Extracting the values
        const hsl = uColor.match(/[.?\d]+/g);

        // Making sure there is a alpha value
        hsl[3] = hsl[3] === undefined ? 1 : hsl[3];

        // Formatting the value properly
        uColor = {
          h: hsl[0],
          s: hsl[1],
          l: hsl[2],
          a: hsl[3],
        };
      }
    }

    // Updating the data object
    this._this.hue = uColor.h;
    this._this.saturation = uColor.s;
    this._this.lightness = uColor.l;
    this._this.alpha = uColor.a;

    // Updating the input values
    this.updateColorValueInput();

    // Updating the Hue color in the Saturation and lightness box
    this._this.shadowRoot.getElementById('saturation').children[1].setAttribute('stop-color', `hsl(${uColor.h}, 100%, 50%)`);

    // Color box (saturation and lightness) config
    // Defining the box and dragger
    const boxDragger = this._this.shadowRoot.getElementById('box_dragger');

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
    boxDragger.attributes.x.nodeValue = x;
    boxDragger.attributes.y.nodeValue = y;

    // Hue slider config
    // Defining the hue slider and dragger
    const hueSliderDragger = this._this.shadowRoot.getElementById('color_slider_dragger');

    // Calculating x value
    let percentHue = 100 - (uColor.h / 359) * 100;
    let hueX = (244 / 100) * percentHue + 11;

    // Making changes the the UI
    hueSliderDragger.attributes.x.nodeValue = hueX;

    // Alpha slider config
    // Defining the opacity slider and dragger
    const alphaSliderDragger = this._this.shadowRoot.getElementById('opacity_slider_dragger');

    // Calculating x value
    let alphaX = (244 / 100) * (uColor.a * 100) + 11;

    // Making changes the the UI
    alphaSliderDragger.attributes.x.nodeValue = alphaX;
  },

  // Update the color value inputs
  updateColorValueInput: function() {
    // Checking the value color type the user has selected
    if (this._this.colorTypeStatus === 'HEXA') {
      // Converting the value
      const hexValue = HSLAToRGBA(this._this.hue, this._this.saturation, this._this.lightness, this._this.alpha, true);

      // Applying the value to the input
      this._this.shadowRoot.getElementById('hex_input').value = hexValue;
    } else if (this._this.colorTypeStatus === 'RGBA') {
      // Converting the value
      const RGBAValue = HSLAToRGBA(this._this.hue, this._this.saturation, this._this.lightness, this._this.alpha);

      // Applying the value to the inputs
      this._this.shadowRoot.querySelectorAll('.rgba_input')[0].value = RGBAValue.r;
      this._this.shadowRoot.querySelectorAll('.rgba_input')[1].value = RGBAValue.g;
      this._this.shadowRoot.querySelectorAll('.rgba_input')[2].value = RGBAValue.b;
      this._this.shadowRoot.querySelectorAll('.rgba_input')[3].value = RGBAValue.a;
    } else {
      // Applying the value to the inputs
      this._this.shadowRoot.querySelectorAll('.hsla_input')[0].value = this._this.hue;
      this._this.shadowRoot.querySelectorAll('.hsla_input')[1].value = this._this.saturation;
      this._this.shadowRoot.querySelectorAll('.hsla_input')[2].value = this._this.lightness;
      this._this.shadowRoot.querySelectorAll('.hsla_input')[3].value = this._this.alpha;
    }
  }
}

export default UpdatePicker;