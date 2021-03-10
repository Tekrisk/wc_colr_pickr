import { LitElement, html } from 'lit-element';

export class SaturationLightnessBox extends LitElement {
  static get properties() {
    return {
      boxX: { type: Number },
      boxY: { type: Number },
      alpha: { type: Number },
      hue: { type: Number },
    };
  }
  
  get boxContainer() {
    return this.querySelector('#color_box');
  } 
  get boxDragger() {
    return this.querySelector('#box_dragger');
  }
  
  constructor() {
    super();
    this.boxStatus = false;
    this.boxTouchStatus = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.colorBoxHandler = this.colorBoxHandler.bind(this);
  }

  // disable shadowRoot for these subcomponents
  createRenderRoot() {
    return this;
  }

  render() {
    return this._getTemplate();
  }

  handleMouseDown(event) {
    // Updating the status in the data object
    this.boxStatus = true;
    // Calling handler function
    this.colorBoxHandler(event.pageX, event.pageY);
  }

  handleMouseMove(event) {
    // Checking that the drag has started
    if (this.boxStatus === true) {
      // Calling handler function
      this.colorBoxHandler(event.pageX, event.pageY);
    }
  }

  handleMouseUp() {
    // Checking that the drag has started
    if (this.boxStatus === true) {
      // Updating the status in the data object
      this.boxStatus = false;
    }
  }

  handleTouchStart(event) {
    // Updating the status
    this.boxTouchStatus = true;
    // Calling the handler function
    this.colorBoxHandler(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
  }

  handleTouchMove(event) {
    // Checking that the touch drag has started
    if (this.boxTouchStatus === true) {
      // Prevent page scrolling
      event.preventDefault();
      // Calling the handler function
      this.colorBoxHandler(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
    }
  }

  handleTouchEnd() {
    // Checking that the touch drag has started
    if (this.boxTouchStatus === true) {
      // Calling the handler function
      this.boxTouchStatus = false;
    }
  }

  /**
   * Saturation and Lightness Box
   */
  // Function to handle changes to the saturation and lightness box
  colorBoxHandler(positionX, positionY, touch) {
    // Defining X and Y position, Y differently works with scroll so I make conditions for that
    let eventX = positionX - this.boxContainer.getBoundingClientRect().left;
    let eventY = touch === true ? positionY - this.boxContainer.getBoundingClientRect().top : positionY - this.boxContainer.getBoundingClientRect().top - window.scrollY;

    // Making conditions so that the user don't drag outside the box
    if (eventX < 14) eventX = 14;
    if (eventX > 252) eventX = 252;
    if (eventY < 14) eventY = 14;
    if (eventY > 119) eventY = 119;

    // Changes X and Y properties of the dragger
    this.boxX = eventX;
    this.boxY = eventY;

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

    const event = new CustomEvent('saturation-lightness-update', {
      detail: {
        saturation: SPercent,
        lightness: LPercent,
      }
    });
    this.dispatchEvent(event);
  }

  _getTemplate() {
    return html`
      <svg id="color_box" width="263" height="130"
        @mousedown=${this.handleMouseDown}
        @touchstart=${this.handleTouchStart}
      >
        <defs>
          <linearGradient id="saturation" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#fff"></stop>
            <stop offset="100%" stop-color="hsla(${this.hue}, 100%, 50%, ${this.alpha})"></stop>
          </linearGradient>
          <linearGradient id="brightness" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(0,0,0,0)"></stop>
            <stop offset="100%" stop-color="#000"></stop>
          </linearGradient>
          <pattern id="pattern_config" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#saturation)"></rect>
            }
            <rect x="0" y="0" width="100%" height="100%" fill="url(#brightness)"></rect>
          </pattern>
        </defs>
        <rect rx="5" ry="5" x="1" y="1" width="263" height="130" stroke="#fff" stroke-width="2" fill="url(#pattern_config)"></rect>
        <svg id="box_dragger" x="${this.boxX}" y="${this.boxY}" style="overflow: visible">
          <circle r="9" fill="none" stroke="#000" stroke-width="2"></circle>
          <circle r="7" fill="none" stroke="#fff" stroke-width="2"></circle>
        </svg>
      </svg>
    `;
  }
}
window.customElements.define('saturation-lightness-box', SaturationLightnessBox);
