export class SaturationLightnessBox {
  constructor(_component) {
    this._component = _component;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.colorBoxHandler = this.colorBoxHandler.bind(this);
  }

  handleMouseDown(event) {
    // Updating the status in the data object
    this._component.boxStatus = true;
    // Calling handler function
    this.colorBoxHandler(event.pageX, event.pageY);
  }

  handleMouseMove(event) {
    // Checking that the drag has started
    if (this._component.boxStatus === true) {
      // Calling handler function
      this.colorBoxHandler(event.pageX, event.pageY);
    }
  }

  handleMouseUp() {
    // Checking that the drag has started
    if (this._component.boxStatus === true) {
      // Updating the status in the data object
      this._component.boxStatus = false;
    }
  }

  handleTouchStart(event) {
    // Updating the status
    this._component.boxStatusTouch = true;
    // Calling the handler function
    this.colorBoxHandler(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
  }

  handleTouchMove(event) {
    // Checking that the touch drag has started
    if (this._component.boxStatusTouch === true) {
      // Prevent page scrolling
      event.preventDefault();
      // Calling the handler function
      this.colorBoxHandler(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
    }
  }

  handleTouchEnd() {
    // Checking that the touch drag has started
    if (this._component.boxStatusTouch === true) {
      // Calling the handler function
      this._component.boxStatusTouch = false;
    }
  }

  /**
   * Saturation and Lightness Box
   */
  // Function to handle changes to the saturation and lightness box
  colorBoxHandler(positionX, positionY, touch) {
    // Defining the box and dragger
    const boxContainer = this._component.shadowRoot.getElementById('color_box');
    const boxDragger = this._component.shadowRoot.getElementById('box_dragger');

    // Defining X and Y position, Y differently works with scroll so I make conditions for that
    let eventX = positionX - boxContainer.getBoundingClientRect().left;
    let eventY = touch === true ? positionY - boxContainer.getBoundingClientRect().top : positionY - boxContainer.getBoundingClientRect().top - window.scrollY;

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
    this._component.saturation = SPercent;
    this._component.lightness = LPercent;

    // Update the color text values
    this._component.UpdatePicker.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this._component.setAttribute('data-color', 'color');

    // Update
    this._component.updatePicker();
  }
}