const HueSlider = {
  _this: null,

  connectedCallback: function() {
    this.initHSEventListeners();
  },

  initHSEventListeners: function() {    
    /**
     * Mouse Events
     */
    // Start the slider drag
    this._this.shadowRoot.getElementById('color_slider').addEventListener('mousedown', (event) => {
      // Updating the status in the data object
      this._this.sliderStatus = true;
      // Calling handler function
      this.colorSliderHandler(event.pageX);
    });

    // Moving the slider drag
    this._this.shadowRoot.addEventListener('mousemove', (event) => {
      // Checking that the drag has started
      if (this._this.sliderStatus === true) {
        // Calling handler function
        this.colorSliderHandler(event.pageX);
      }
    });

    // End the slider drag
    this._this.shadowRoot.addEventListener('mouseup', () => {
      // Checking that the drag has started
      if (this._this.sliderStatus === true) {
        // Updating the status in the data object
        this._this.sliderStatus = false;
      }
    });

    /**
     * Touch Events
     */
    // Start the slider drag on touch
    this._this.shadowRoot.getElementById('color_slider').addEventListener(
      'touchstart',
      (event) => {
        // Updating the status
        this._this.sliderStatusTouch = true;
        // Calling the handler function
        this.colorSliderHandler(event.changedTouches[0].clientX);
      },
      { passive: true }
    );

    // Moving the slider drag on touch
    this._this.shadowRoot.addEventListener(
      'touchmove',
      () => {
        // Checking that the touch drag has started
        if (this._this.sliderStatusTouch === true) {
          // Prevent page scrolling
          event.preventDefault();
          // Calling the handler function
          this.colorSliderHandler(event.changedTouches[0].clientX);
        }
      },
      { passive: false }
    );

    // End the slider drag on touch
    this._this.shadowRoot.addEventListener('touchend', () => {
      // Checking that the touch drag has started
      if (this._this.sliderStatusTouch === true) {
        // Updating the status
        this._this.sliderStatusTouch = false;
      }
    });
  },

  // Function to handle changes to the HUE slider
  colorSliderHandler: function(position) {
    // Defining the slider and dragger
    const sliderContainer = this._this.shadowRoot.getElementById('color_slider');
    const sliderDragger = this._this.shadowRoot.getElementById('color_slider_dragger');

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
    this._this.hue = HColor;

    // Updating the Hue color in the Saturation and lightness box
    this._this.shadowRoot.getElementById('saturation').children[1].setAttribute('stop-color', `hsla(${HColor}, 100%, 50%, ${this._this.alpha})`);

    // Update the color text values
    this._this.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this._this.setAttribute('data-color', 'color');

    // Update
    this._this.updatePicker();
  }
}

export default HueSlider;