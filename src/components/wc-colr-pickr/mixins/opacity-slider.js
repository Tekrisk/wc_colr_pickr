export class OpacitySlider {
  constructor(_component) {
    this._component = _component;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  handleMouseDown(event) {
    // Updating the status in the data object
    this._component.opacityStatus = true;
    // Calling the handler function
    this.opacitySliderHandler(event.pageX);
  }

  handleMouseMove(event) {
    // Checking that the drag has started
    if (this._component.opacityStatus === true) {
      // Calling the handler function
      this.opacitySliderHandler(event.pageX);
    }
  }

  handleMouseUp() {
    // Checking that the drag has started
    if (this._component.opacityStatus === true) {
      // Updating the status in the data object
      this._component.opacityStatus = false;
    }
  }

  handleTouchStart(event) {
    // Updating the status
    this._component.opacityStatusTouch = true;
    // Calling the handler function
    this.opacitySliderHandler(event.changedTouches[0].clientX);
  }

  handleTouchMove(event) {
    // Checking that the touch drag has started
    if (this._component.opacityStatusTouch === true) {
      // Prevent page scrolling
      event.preventDefault();
      // Calling the handler function
      this.opacitySliderHandler(event.changedTouches[0].clientX);
    }
  }

  handleTouchEnd() {
    // Checking that the touch drag has started
    if (this._component.opacityStatusTouch === true) {
      // Updating the status
      this._component.opacityStatusTouch = false;
    }
  }

  /**
   * Opacity Slider
   */

  // Function to handle changes to the opacity slider
  opacitySliderHandler(position) {
    // Defining the slider and dragger
    const sliderContainer = this._component.shadowRoot.getElementById('opacity_slider');
    const sliderDragger = this._component.shadowRoot.getElementById('opacity_slider_dragger');

    // Defining the X position
    let eventX = position - sliderContainer.getBoundingClientRect().left;

    // Making conditions so that the user don't drag outside the box
    if (eventX < 11) eventX = 11;

    if (eventX > 255) eventX = 255;

    // Update the X property of the dragger
    sliderDragger.attributes.x.nodeValue = eventX;

    // Percentage of the dragger on the X axis
    const percent = ((eventX - 11) / 244) * 100;

    // Finding the value for the percentage of 1
    let alpha = (1 / 100) * percent;
    // Rounding the value to the nearest 2 decimals
    alpha = Number(Math.round(alpha + 'e' + 2) + 'e-' + 2);

    // Updating the data objects
    this._component.alpha = alpha;

    // Update the color text values
    this._component.UpdatePicker.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this._component.setAttribute('data-color', 'color');

    // Update
    this._component.updatePicker();
  }
}