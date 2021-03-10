import { LitElement, html } from 'lit-element';

export class HueSlider extends LitElement {
  static get properties() {
    return {
      hueX: { type: Number },
    };
  }
  
  constructor() {
    super();
    this.sliderStatus = false;
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
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
    // Calling handler function
    this.handleUpdate(event.pageX);
  }

  handleMouseMove(event) {
    // Checking that the drag has started
    if (this.sliderStatus) {
      // Calling handler function
      this.handleUpdate(event.pageX);
    }
  }

  handleMouseUp() {
    // Checking that the drag has started
    if (this.sliderStatus) {
      // Updating the status in the data object
      this.sliderStatus = false;
    }
  }

  handleTouchStart(event) {
    // Updating the status
    this.sliderStatusTouch = true;
    // Calling the handler function
    this.handleUpdate(event.changedTouches[0].clientX);
  }

  handleTouchMove(event) {
    // Checking that the touch drag has started
    if (this.sliderStatusTouch === true) {
      // Prevent page scrolling
      event.preventDefault();
      // Calling the handler function
      this.handleUpdate(event.changedTouches[0].clientX);
    }
  }

  handleTouchEnd() {
    // Checking that the touch drag has started
    if (this.sliderStatusTouch === true) {
      // Updating the status
      this.sliderStatusTouch = false;
    }
  }

  // Function to handle changes to the HUE slider
  handleUpdate(position) {
    const event = new CustomEvent('hue-update', {
      detail: { position }
    });
    this.dispatchEvent(event);
  }

  _getTemplate() {
    return html`
      <svg id="color_slider" width="263" height="20" 
        @mousedown=${this.handleMouseDown}
        @touchstart=${this.handleTouchStart}
      >
        <defs>
          <linearGradient id="hue" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#f00"></stop>
            <stop offset="16.666%" stop-color="#ff0"></stop>
            <stop offset="33.333%" stop-color="#0f0"></stop>
            <stop offset="50%" stop-color="#0ff"></stop>
            <stop offset="66.666%" stop-color="#00f"></stop>
            <stop offset="83.333%" stop-color="#f0f"></stop>
            <stop offset="100%" stop-color="#f00"></stop>
          </linearGradient>
        </defs>
        <rect rx="5" ry="5" x="1" y="1" width="263" height="20" stroke="#fff" stroke-width="2" fill="url(#hue)"></rect>
        <svg id="color_slider_dragger" x="${this.hueX}" y="11" style="overflow: visible">
          <circle r="7" fill="none" stroke="#000" stroke-width="2"></circle>
          <circle r="5" fill="none" stroke="#fff" stroke-width="2"></circle>
        </svg>
      </svg>
    `;
  }
}
window.customElements.define('hue-slider', HueSlider);
