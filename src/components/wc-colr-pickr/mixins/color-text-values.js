import { HSLAToRGBA } from '../utility/color-conversion';

export class ColorTextValues {
  constructor(_component) {
    this._component = _component;
    this.switchColorType = this.switchColorType.bind(this);
    this.handleHexBlur = this.handleHexBlur.bind(this);
    this.handleRgbaChange = this.handleRgbaChange.bind(this);
    this.handleHslaChange = this.handleHslaChange.bind(this);
  }

  // Function to switch the color type inputs
  switchColorType() {
    // Checking the current selected input color type
    if (this._component.colorTypeStatus === 'HEXA') {
      // Updating the data object
      this._component.colorTypeStatus = 'RGBA';

      // Displaying the correct elements
      this._component.shadowRoot.getElementById('hexa').style.display = 'none';
      this._component.shadowRoot.getElementById('rgba').style.display = 'block';

      // Converting the value
      const RGBAValue = HSLAToRGBA(this._component.hue, this._component.saturation, this._component.lightness, this._component.alpha);

      // Applying the value to the inputs
      this._component.shadowRoot.querySelectorAll('.rgba_input')[0].value = RGBAValue.r;
      this._component.shadowRoot.querySelectorAll('.rgba_input')[1].value = RGBAValue.g;
      this._component.shadowRoot.querySelectorAll('.rgba_input')[2].value = RGBAValue.b;
      this._component.shadowRoot.querySelectorAll('.rgba_input')[3].value = RGBAValue.a;
    } else if (this._component.colorTypeStatus === 'RGBA') {
      // Updating the data object
      this._component.colorTypeStatus = 'HSLA';

      // Displaying the correct elements
      this._component.shadowRoot.getElementById('rgba').style.display = 'none';
      this._component.shadowRoot.getElementById('hsla').style.display = 'block';

      // Applying the value to the inputs
      this._component.shadowRoot.querySelectorAll('.hsla_input')[0].value = this._component.hue;
      this._component.shadowRoot.querySelectorAll('.hsla_input')[1].value = this._component.saturation;
      this._component.shadowRoot.querySelectorAll('.hsla_input')[2].value = this._component.lightness;
      this._component.shadowRoot.querySelectorAll('.hsla_input')[3].value = this._component.alpha;
    } else if (this._component.colorTypeStatus === 'HSLA') {
      // Updating the data object
      this._component.colorTypeStatus = 'HEXA';

      // Displaying the correct elements
      this._component.shadowRoot.getElementById('hsla').style.display = 'none';
      this._component.shadowRoot.getElementById('hexa').style.display = 'block';

      // Converting the value
      const hexValue = HSLAToRGBA(this._component.hue, this._component.saturation, this._component.lightness, this._component.alpha, true);

      // Applying the value to the input
      this._component.shadowRoot.getElementById('hex_input').value = hexValue;
    }
  }

  handleHexBlur() {
    // Value
    const hexInput = this._component.shadowRoot.getElementById('hex_input').value;

    // Check to see if the hex is formatted correctly
    if (hexInput.match(/^#[0-9a-f]{3}([0-9a-f]{3})?([0-9a-f]{2})?$/)) {
      // Updating the picker
      this._component.UpdatePicker.updateColorDisplays(hexInput);

      // Update
      this._component.updatePicker();
    }
  }

  handleRgbaChange() {
    // Input boxes
    const rgbaInput = this._component.shadowRoot.querySelectorAll('.rgba_input');

    // Checking that the numbers are within the correct boundaries
    if (rgbaInput[0].value > 255) throw new Error('Value must be below 256');
    if (rgbaInput[1].value > 255) throw new Error('Value must be below 256');
    if (rgbaInput[2].value > 255) throw new Error('Value must be below 256');
    if (rgbaInput[3].value > 1) throw new Error('Value must be equal to or below 1');

    // Updating the picker
    this._component.UpdatePicker.updateColorDisplays(`rgba(${rgbaInput[0].value}, ${rgbaInput[1].value}, ${rgbaInput[2].value}, ${rgbaInput[3].value})`);

    // Update
    this._component.updatePicker();
  }

  handleHslaChange() {
    // Input boxes
    const hslaInput = this._component.shadowRoot.querySelectorAll('.hsla_input');

    // Checking that the numbers are within the correct boundaries
    if (hslaInput[0].value > 359) throw new Error('Value must be below 360');
    if (hslaInput[1].value > 100) throw new Error('Value must be below 100');
    if (hslaInput[2].value > 100) throw new Error('Value must be below 100');
    if (hslaInput[3].value > 1) throw new Error('Value must be equal to or below 1');

    // Updating the picker
    this._component.UpdatePicker.updateColorDisplays(`hsla(${hslaInput[0].value}, ${hslaInput[1].value}%, ${hslaInput[2].value}%, ${hslaInput[3].value})`);

    // Update
    this._component.updatePicker();
  }
}