const OpacitySlider = {
  _this: null,

  connectedCallback: function() {
    this.initOSEventListeners();
  },

  initOSEventListeners: function() {
    /**
     * Mouse Events
     */
    // Start the slider drag for opacity
    this._this.shadowRoot.getElementById('opacity_slider').addEventListener('mousedown', (event) => {
      // Updating the status in the data object
      this._this.opacityStatus = true;
      // Calling the handler function
      this.opacitySliderHandler(event.pageX);
    });

    // Moving the slider drag for opacity
    this._this.shadowRoot.addEventListener('mousemove', (event) => {
      // Checking that the drag has started
      if (this._this.opacityStatus === true) {
        // Calling the handler function
        this.opacitySliderHandler(event.pageX);
      }
    });

    // End the slider drag
    this._this.shadowRoot.addEventListener('mouseup', () => {
      // Checking that the drag has started
      if (this._this.opacityStatus === true) {
        // Updating the status in the data object
        this._this.opacityStatus = false;
      }
    });

    /**
     * Touch Events
     */

    // Start the slider drag on touch
    this._this.shadowRoot.getElementById('opacity_slider').addEventListener(
      'touchstart',
      (event) => {
        // Updating the status
        this._this.opacityStatusTouch = true;
        // Calling the handler function
        this.opacitySliderHandler(event.changedTouches[0].clientX);
      },
      { passive: true }
    );

    // Moving the slider drag on touch
    this._this.shadowRoot.addEventListener(
      'touchmove',
      (event) => {
        // Checking that the touch drag has started
        if (this._this.opacityStatusTouch === true) {
          // Prevent page scrolling
          event.preventDefault();
          // Calling the handler function
          this.opacitySliderHandler(event.changedTouches[0].clientX);
        }
      },
      { passive: false }
    );

    // End the slider drag on touch
    this._this.shadowRoot.addEventListener('touchend', () => {
      // Checking that the touch drag has started
      if (this._this.opacityStatusTouch === true) {
        // Updating the status
        this._this.opacityStatusTouch = false;
      }
    });
  },

  /**
   * Opacity Slider
   */

  // Function to handle changes to the opacity slider
  opacitySliderHandler: function(position) {
    // Defining the slider and dragger
    const sliderContainer = this._this.shadowRoot.getElementById('opacity_slider');
    const sliderDragger = this._this.shadowRoot.getElementById('opacity_slider_dragger');

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
    this._this.alpha = alpha;

    // Update the color text values
    this._this.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this._this.setAttribute('data-color', 'color');

    // Update
    this._this.updatePicker();
  }
}

export default OpacitySlider;