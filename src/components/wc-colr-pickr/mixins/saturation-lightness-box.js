const SaturationLightnessBox = {
  _this: null,

  connectedCallback: function() {
    this.initSLBEventListeners();
  },

  initSLBEventListeners: function() {
    /**
     * Mouse Events
     */

    // Start box drag listener
    this._this.shadowRoot.getElementById('color_box').addEventListener('mousedown', (event) => {
      // Updating the status in the data object
      this._this.boxStatus = true;
      // Calling handler function
      this.colorBoxHandler(event.pageX, event.pageY);
    });

    // Moving box drag listener
    this._this.shadowRoot.addEventListener('mousemove', (event) => {
      // Checking that the drag has started
      if (this._this.boxStatus === true) {
        // Calling handler function
        this.colorBoxHandler(event.pageX, event.pageY);
      }
    });

    // End box drag listener
    this._this.shadowRoot.addEventListener('mouseup', () => {
      // Checking that the drag has started
      if (this._this.boxStatus === true) {
        // Updating the status in the data object
        this._this.boxStatus = false;
      }
    });

    /**
     * Touch Events
     */
    // Start the box drag on touch
    this._this.shadowRoot.getElementById('color_box').addEventListener(
      'touchstart',
      (event) => {
        // Updating the status
        this._this.boxStatusTouch = true;
        // Calling the handler function
        this.colorBoxHandler(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
      },
      { passive: true }
    );

    // Moving the box drag on touch
    this._this.shadowRoot.addEventListener(
      'touchmove',
      (event) => {
        // Checking that the touch drag has started
        if (this._this.boxStatusTouch === true) {
          // Prevent page scrolling
          event.preventDefault();
          // Calling the handler function
          this.colorBoxHandler(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
        }
      },
      { passive: false }
    );

    // End box drag on touch
    this._this.shadowRoot.addEventListener('touchend', () => {
      // Checking that the touch drag has started
      if (this._this.boxStatusTouch === true) {
        // Calling the handler function
        this._this.boxStatusTouch = false;
      }
    });
  },

  /**
   * Saturation and Lightness Box
   */
  // Function to handle changes to the saturation and lightness box
  colorBoxHandler: function(positionX, positionY, touch) {
    // Defining the box and dragger
    const boxContainer = this._this.shadowRoot.getElementById('color_box');
    const boxDragger = this._this.shadowRoot.getElementById('box_dragger');

    // Defining X and Y position, Y differently works with scroll so I make conditions for that
    let eventX = positionX - boxContainer.getBoundingClientRect().left;
    let eventY =
      touch === true
        ? positionY - boxContainer.getBoundingClientRect().top
        : positionY - boxContainer.getBoundingClientRect().top - window.scrollY;

    // Making conditions so that the user don't drag outside the box
    if (eventX < 14) eventX = 14;

    if (eventX > 252) eventX = 252;

    if (eventY < 14) eventY = 14;

    if (eventY > 119) eventY = 119;

    // Changes X and Y properties of the dragger
    boxDragger.attributes.y.nodeValue = eventY;
    boxDragger.attributes.x.nodeValue = eventX;

    // Calculating the Saturation Percent value
    // SPercent is just the percent of where the dragger is on the X axis
    // 322 is the max number of pixels the dragger can move
    const SPercent = Math.round(((eventX - 15) / 238) * 100);

    // Calculating the X and Y Percent Values
    const percentX = 100 - SPercent / 2;
    const percentY = 100 - ((eventY - 15) / 105) * 100;

    // Calculating the LPercent
    // LPercent is the the X percentage of the of the Y percentage of the dragger
    const LPercent = Math.floor((percentY / 100) * percentX);

    // Applying the Saturation and Lightness to the data object
    this._this.saturation = SPercent;
    this._this.lightness = LPercent;

    // Update the color text values
    this._this.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this._this.setAttribute('data-color', 'color');

    // Update
    this._this.updatePicker();
  }
}

export default SaturationLightnessBox;