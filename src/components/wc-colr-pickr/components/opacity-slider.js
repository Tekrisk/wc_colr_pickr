import { LitElement, html } from 'lit-element';

export class OpacitySlider extends LitElement {
  static get properties() {
    return {
      alphaX: { type: Number },
    };
  }

  get opacitySlider() {
    return this.querySelector('#opacity_slider');
  }
  
  constructor() {
    super();
    this.sliderStatus = false;
    this.sliderStatusTouch = false;
    this.opacitySliderHandler = this.opacitySliderHandler.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
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
    this.sliderStatus = true;
    // Calling the handler function
    this.opacitySliderHandler(event.pageX);
  }

  handleMouseMove(event) {
    // Checking that the drag has started
    if (this.sliderStatus === true) {
      // Calling the handler function
      this.opacitySliderHandler(event.pageX);
    }
  }

  handleMouseUp() {
    // Checking that the drag has started
    if (this.sliderStatus === true) {
      // Updating the status in the data object
      this.sliderStatus = false;
    }
  }

  handleTouchStart(event) {
    // Updating the status
    this.sliderStatusTouch = true;
    // Calling the handler function
    this.opacitySliderHandler(event.changedTouches[0].clientX);
  }

  handleTouchMove(event) {
    // Checking that the touch drag has started
    if (this.sliderStatusTouch === true) {
      // Prevent page scrolling
      event.preventDefault();
      // Calling the handler function
      this.opacitySliderHandler(event.changedTouches[0].clientX);
    }
  }

  handleTouchEnd() {
    // Checking that the touch drag has started
    if (this.sliderStatusTouch === true) {
      // Updating the status
      this.sliderStatusTouch = false;
    }
  }

  // Function to handle changes to the opacity slider
  opacitySliderHandler(position) {
    // Defining the X position
    let eventX = position - this.opacitySlider.getBoundingClientRect().left;

    // Making conditions so that the user don't drag outside the box
    if (eventX < 11) eventX = 11;

    if (eventX > 255) eventX = 255;

    // Percentage of the dragger on the X axis
    const percent = ((eventX - 11) / 244) * 100;

    // Finding the value for the percentage of 1
    let alpha = (1 / 100) * percent;
    // Rounding the value to the nearest 2 decimals
    alpha = Number(Math.round(alpha + 'e' + 2) + 'e-' + 2);

    const event = new CustomEvent('opacity-update', {
      detail: {
        alpha: alpha,
        alphaX: eventX,
      }
    });
    this.dispatchEvent(event);
  }

  _getTemplate() {
    return html`
      <svg id="opacity_slider" width="263" height="20"
        @mousedown=${this.handleMouseDown}
        @touchstart=${this.handleTouchStart}
      >
        <defs>
          <linearGradient id="opacity" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#000"></stop>
            <stop offset="100%" stop-color="#fff"></stop>
          </linearGradient>
        </defs>
        <rect rx="5" ry="5" x="1" y="6" width="263" height="10" stroke="#fff" stroke-width="2" fill="url(#opacity)"></rect>
        <svg id="opacity_slider_dragger" x="${this.alphaX}" y="11" style="overflow: visible">
          <circle r="7" fill="none" stroke="#000" stroke-width="2"></circle>
          <circle r="5" fill="none" stroke="#fff" stroke-width="2"></circle>
        </svg>
      </svg>
    `;
  }
}
window.customElements.define('opacity-slider', OpacitySlider);
