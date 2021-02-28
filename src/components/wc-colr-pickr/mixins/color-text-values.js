import { HSLAToRGBA } from '../utility/color-conversion';

const ColorTextValues = {
  _this: null,

  // Function to switch the color type inputs
  switchColorType: function () {
    // Checking the current selected input color type
    if (this._this.colorTypeStatus === 'HEXA') {
      // Updating the data object
      this._this.colorTypeStatus = 'RGBA';

      // Displaying the correct elements
      this._this.shadowRoot.getElementById('hexa').style.display = 'none';
      this._this.shadowRoot.getElementById('rgba').style.display = 'block';

      // Converting the value
      const RGBAValue = HSLAToRGBA(this._this.hue, this._this.saturation, this._this.lightness, this._this.alpha);

      // Applying the value to the inputs
      this._this.shadowRoot.querySelectorAll('.rgba_input')[0].value = RGBAValue.r;
      this._this.shadowRoot.querySelectorAll('.rgba_input')[1].value = RGBAValue.g;
      this._this.shadowRoot.querySelectorAll('.rgba_input')[2].value = RGBAValue.b;
      this._this.shadowRoot.querySelectorAll('.rgba_input')[3].value = RGBAValue.a;
    } else if (this._this.colorTypeStatus === 'RGBA') {
      // Updating the data object
      this._this.colorTypeStatus = 'HSLA';

      // Displaying the correct elements
      this._this.shadowRoot.getElementById('rgba').style.display = 'none';
      this._this.shadowRoot.getElementById('hsla').style.display = 'block';

      // Applying the value to the inputs
      this._this.shadowRoot.querySelectorAll('.hsla_input')[0].value = this._this.hue;
      this._this.shadowRoot.querySelectorAll('.hsla_input')[1].value = this._this.saturation;
      this._this.shadowRoot.querySelectorAll('.hsla_input')[2].value = this._this.lightness;
      this._this.shadowRoot.querySelectorAll('.hsla_input')[3].value = this._this.alpha;
    } else if (this._this.colorTypeStatus === 'HSLA') {
      // Updating the data object
      this._this.colorTypeStatus = 'HEXA';

      // Displaying the correct elements
      this._this.shadowRoot.getElementById('hsla').style.display = 'none';
      this._this.shadowRoot.getElementById('hexa').style.display = 'block';

      // Converting the value
      const hexValue = HSLAToRGBA(this._this.hue, this._this.saturation, this._this.lightness, this._this.alpha, true);

      // Applying the value to the input
      this._this.shadowRoot.getElementById('hex_input').value = hexValue;
    }
  },

  connectedCallback: function () {
    this._this.shadowRoot.getElementById('switch_color_type').addEventListener('click', () => {
      this.switchColorType();
    });

    // Event to update the color when the user leaves the hex value box
    this._this.shadowRoot.getElementById('hex_input').addEventListener('blur', () => {
      // Value
      const hexInput = this._this.shadowRoot.getElementById('hex_input').value;

      // Check to see if the hex is formatted correctly
      if (hexInput.match(/^#[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/)) {
        // Updating the picker
        this._this.updateColorDisplays(hexInput);

        // Update
        this._this.updatePicker();
      }
    });

    // Gathering all the rgba inputs boxes
    this._this.shadowRoot.querySelectorAll('.rgba_input').forEach((element) => {
      // Event to update the color when the user changes the value to any of the input boxes
      element.addEventListener('change', () => {
        // Input boxes
        const rgbaInput = this._this.shadowRoot.querySelectorAll('.rgba_input');

        // Checking that the numbers are within the correct boundaries
        if (rgbaInput[0].value > 255) throw new Error('Value must be below 256');
        if (rgbaInput[1].value > 255) throw new Error('Value must be below 256');
        if (rgbaInput[2].value > 255) throw new Error('Value must be below 256');
        if (rgbaInput[3].value > 1) throw new Error('Value must be equal to or below 1');

        // Updating the picker
        this._this.updateColorDisplays(`rgba(${rgbaInput[0].value}, ${rgbaInput[1].value}, ${rgbaInput[2].value}, ${rgbaInput[3].value})`);

        // Update
        this._this.updatePicker();
      });
    });

    // Gathering all the hsla inputs boxes
    this._this.shadowRoot.querySelectorAll('.hsla_input').forEach((element) => {
      // Event to update the color when the user changes the value to any of the input boxes
      element.addEventListener('change', () => {
        // Input boxes
        const hslaInput = this._this.shadowRoot.querySelectorAll('.hsla_input');

        // Checking that the numbers are within the correct boundaries
        if (hslaInput[0].value > 359) throw new Error('Value must be below 360');
        if (hslaInput[1].value > 100) throw new Error('Value must be below 100');
        if (hslaInput[2].value > 100) throw new Error('Value must be below 100');
        if (hslaInput[3].value > 1) throw new Error('Value must be equal to or below 1');

        // Updating the picker
        this._this.updateColorDisplays(`hsla(${hslaInput[0].value}, ${hslaInput[1].value}%, ${hslaInput[2].value}%, ${hslaInput[3].value})`);

        // Update
        this._this.updatePicker();
      });
    });
  },
};

export default ColorTextValues;
