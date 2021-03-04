export class HueSlider {
  constructor(_component) {
    this._component = _component;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.colorSliderHandler = this.colorSliderHandler.bind(this);
  }

  handleMouseDown(event) {
    // Updating the status in the data object
    this._component.sliderStatus = true;
    // Calling handler function
    this.colorSliderHandler(event.pageX);
  }

  handleMouseMove(event) {
    // Checking that the drag has started
    if (this._component.sliderStatus === true) {
      // Calling handler function
      this.colorSliderHandler(event.pageX);
    }
  }

  handleMouseUp() {
    // Checking that the drag has started
    if (this._component.sliderStatus === true) {
      // Updating the status in the data object
      this._component.sliderStatus = false;
    }
  }

  handleTouchStart(event) {
    // Updating the status
    this._component.sliderStatusTouch = true;
    // Calling the handler function
    this.colorSliderHandler(event.changedTouches[0].clientX);
  }

  handleTouchMove() {
    // Checking that the touch drag has started
    if (this._component.sliderStatusTouch === true) {
      // Prevent page scrolling
      event.preventDefault();
      // Calling the handler function
      this.colorSliderHandler(event.changedTouches[0].clientX);
    }
  }

  handleTouchEnd() {
    // Checking that the touch drag has started
    if (this._component.sliderStatusTouch === true) {
      // Updating the status
      this._component.sliderStatusTouch = false;
    }
  }

  // Function to handle changes to the HUE slider
  colorSliderHandler(position) {
    // Defining the slider and dragger
    const sliderContainer = this._component.shadowRoot.getElementById('color_slider');
    const sliderDragger = this._component.shadowRoot.getElementById('color_slider_dragger');

    // Defining the X position
    let eventX = position - sliderContainer.getBoundingClientRect().left;

    // Making conditions so that the user don't drag outside the box
    if (eventX < 11) eventX = 11;

    if (eventX > 255) eventX = 255;

    // Updating the X property of the dragger
    sliderDragger.attributes.x.nodeValue = eventX;

    // Percentage of the dragger on the X axis
    const percent = ((eventX - 11) / 244) * 100;

    // Calculating the color
    // Max number for hue colors is 359, I find the percentage of this, from the percent variable
    // I take it away from the max number because the slider should work backwards
    const HColor = Math.round(359 - (359 / 100) * percent);

    // Updating the Hue value in the data object
    this._component.hue = HColor;

    // Updating the Hue color in the Saturation and lightness box
    this._component.shadowRoot.getElementById('saturation').children[1].setAttribute('stop-color', `hsla(${HColor}, 100%, 50%, ${this._component.alpha})`);

    // Update the color text values
    this._component.UpdatePicker.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this._component.setAttribute('data-color', 'color');

    // Update
    this._component.updatePicker();
  }
}