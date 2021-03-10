import { LitElement, html, css } from 'lit-element';
import scss from './wc-colr-pickr.scss';
import { ColorChangeEvent } from './components/color-change-event';
import { ColorTextValues } from './components/color-text-values';
import './components/custom-colors';
import './components/hue-slider';
import './components/opacity-slider';
import './components/saturation-lightness-box';
import { UpdatePicker } from './components/update-picker';

/**
 * Private properties used inside the module.
 * @type {Object}
 */
const Static = {
  elementInstance: 0,
  component: 'wc-colr-pickr',
  debug: !production,
};
Object.seal(Static);

/**
 * WCColrPickr web component.
 *
 * @element wc-colr-pickr
 */
export class WCColrPickr extends LitElement {
  // This decorator creates a property accessor that triggers rendering and
  // an observed attribute.
  static get properties() {
    return {
      selectedColor: { type: String },
      hue: { type: Number },
      hueX: { type: Number },
      saturation: { type: Number },
      lightness: { type: Number },
      alpha: { type: Number },
      alphaX: { type: Number },
      boxX: { type: Number },
      boxY: { type: Number },
    };
  }

  static get styles() {
    return css(scss);
  }

  get button() {
    if (this.shadowRoot.getElementById('toggle_pickr')) {
      return this.shadowRoot.getElementById('toggle_pickr');
    }

    return null;
  }

  get hueSlider() {
    return this.shadowRoot.querySelector('hue-slider');
  }

  get opacitySlider() {
    return this.shadowRoot.querySelector('opacity-slider');
  }

  get saturationLightnessBox() {
    return this.shadowRoot.querySelector('saturation-lightness-box');
  }

  get colorSliderContainer() {
    return this.shadowRoot.getElementById('color_slider');
  }

  get colorSliderDragger() {
    return this.shadowRoot.getElementById('color_slider_dragger');
  }

  /**
   * Creates an instance of WCColrPickr.
   * @memberof WCColrPickr
   */
  constructor() {
    super();
    Static.elementInstance++;

    this.alpha = 1;
    this.hue = 0;
    this.hueX = 255;
    this.alphaX = 255;
    this.boxX = 336;
    this.boxY = 14;

    this.selectedColor = '#ff0000';
    this.pickerOpen = false;
    this.instance = null;
    this.boxStatus = false;
    this.boxStatusTouch = false;
    this.colorTypeStatus = 'HEXA';
    this.saturation = 100;
    this.lightness = 50;
    this.contextMenuElem = null;
    this.doubleTapTime = 0;
    this.customColors = {
      0: [
        {
          value: 'red',
        },
        {
          value: 'blue',
        },
        {
          value: 'green',
        },
        {
          value: 'yellow',
        },
        {
          value: 'purple',
        },
        {
          value: 'orange',
        },
        {
          value: 'lime',
        },
      ],
    };
    this.UpdatePicker = new UpdatePicker(this);
    this.ColorChangeEvent = new ColorChangeEvent(this);
    this.ColorTextValues = new ColorTextValues(this);
    this._togglePicker = this._togglePicker.bind(this);
    this._rootMouseMove = this._rootMouseMove.bind(this);
    this._rootMouseUp = this._rootMouseUp.bind(this);
    this._rootTouchMoveevent = this._rootTouchMoveevent.bind(this);
    this._rootTouchEnd = this._rootTouchEnd.bind(this);
  }

  render() {
    return this._getTemplate();
  }

  /**
   * Invoked when the custom element is first connected to the document's DOM
   * @memberof WCColrPickr
   */
  connectedCallback() {
    super.connectedCallback();
    // init properties by attributes or set default
    if (Static.debug) {
      console.debug(`${Static.component}.connectedCallback, initialized properties:`);
    }

    this.initPickR();
  }

  /**
   * Invoked when the custom element is disconnected from the document's DOM
   * @memberof WCColrPickr
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (Static.debug) {
      console.debug(`${Static.component}.disconnectCallback`);
    }
  }

  /**
   * Invoked when the custom element is moved to a new document
   * @memberof WCColrPickr
   */
  adoptedCallback() {
    super.adoptedCallback();
    if (Static.debug) {
      console.debug(`${Static.component}.adoptedCallback`, this);
    }
  }

  initPickR() {
    // Checking if a local storage variable has been set
    if (localStorage.getItem('colrpickr_custom_colors') === null) {
      // If not then I set one
      localStorage.setItem('colrpickr_custom_colors', JSON.stringify(this.customColors));
    } else {
      // If it has then I define the CustomColors with the value for this
      this.customColors = JSON.parse(localStorage.getItem('colrpickr_custom_colors'));
    }

    // Click anywhere to close a pop-up
    window.addEventListener('mousedown', (event) => {
      // Close context menu
      if (event.target.id !== 'color_context_menu') {
        this.shadowRoot.getElementById('color_context_menu').style.display = 'none';
      }
    });

    // Click the darken background to close the color picker
    window.addEventListener('mousedown', (event) => {
      // close if picker is open and target is picker tag...
      if (this.pickerOpen && event.target.tagName !== 'WC-COLR-PICKR') {
        this.closePicker();
      }
    });

    // Click the darken background to close the color picker
    window.addEventListener('mousemove', (event) => {
      // close if picker is open and target is picker tag...
      if (this.pickerOpen && event.target.tagName !== 'WC-COLR-PICKR') {
        this._rootMouseMove(event);
      }
    });

    // Click the darken background to close the color picker
    window.addEventListener('mouseup', (event) => {
      // close if picker is open and target is picker tag...
      if (this.pickerOpen && event.target.tagName !== 'WC-COLR-PICKR') {
        this._rootMouseUp(event);
      }
    });

    // Click the darken background to close the color picker
    window.addEventListener('touchmove', (event) => {
      // close if picker is open and target is picker tag...
      if (this.pickerOpen && event.target.tagName !== 'WC-COLR-PICKR') {
        this._rootTouchMove(event);
      }
    });

    // Click the darken background to close the color picker
    window.addEventListener('touchend', (event) => {
      // close if picker is open and target is picker tag...
      if (this.pickerOpen && event.target.tagName !== 'WC-COLR-PICKR') {
        this._rootTouchEnd(event);
      }
    });

    // When scrolling
    window.addEventListener('scroll', () => {
      // If picker is open...
      if (this.pickerOpen) {
        this.closePicker(); // Close picker
      }
    });

    // When using mouse wheel
    window.addEventListener('resize', () => {
      // If picker is open...
      if (this.pickerOpen) {
        this.closePicker(); // Close picker
      }
    });
  }

  keyShortcuts(event) {
    // Define key code
    const key = event.keyCode;

    // Check for key code
    switch (key) {
      // Del
      case 46:
        // If focused element is a custom color...
        if (document.activeElement.className === 'custom_colors_preview') {
          // Delete it
          CustomColor.clearSingleCustomColor(document.activeElement);
        }
        break;
      // Esc
      case 27:
        // If picker is open...
        if (this.pickerOpen) {
          this.closePicker(); // Close picker
        }
        break;
      default:
        break;
    }
  }

  // Close the picker
  closePicker() {
    // Update state
    this.pickerOpen = false;

    // Hiding elements
    this.shadowRoot.getElementById('color_picker').style.display = 'none';

    // Checking if the color for this instance has not been set yet
    if (!this.button.getAttribute('data-color')) {
      return;
    }

    // Update
    this.updatePicker();
  }

  updatePicker() {
    // Calling Event to make all the necessary changes
    this.ColorChangeEvent.colorChange({
      h: this.hue,
      s: this.saturation,
      l: this.lightness,
      a: this.alpha,
    });
  }

  _togglePicker() {
    // Update state
    this.pickerOpen = true;

    // Define picker
    const picker = this.shadowRoot.getElementById('color_picker');

    // Displaying the color picker
    picker.style.display = 'grid';

    if (!this.button) {
      return;
    }

    // Find position of button
    let top = this.button.getBoundingClientRect().top;
    let left = this.button.getBoundingClientRect().left;

    // If the picker will go off bottom of screen...
    if (top + picker.offsetHeight > window.innerHeight) {
      // Place it above the button
      top = top - picker.offsetHeight - 2;
    }
    // If the picker will go off top of screen...
    else {
      // Place it beneath the button
      top = top + this.button.offsetHeight + 2;
    }

    // If the picker will go off the right of screen...
    if (left + picker.offsetWidth > window.innerWidth - 20) {
      // Calculate the difference
      let difference = left + picker.offsetWidth - window.innerWidth;

      // Move the picker back by the difference
      left = left - difference - 20;
    }

    // Applying the position
    picker.style.top = top + 'px';
    picker.style.left = left + 'px';

    // Updating the color picker
    this.UpdatePicker.updateColorDisplays(this.button.getAttribute('data-color'));

    // Focus on a picker item
    this.shadowRoot.getElementById('color_text_values').focus();

    picker.addEventListener('keydown', this.keyShortcuts.bind(this));
  }

  _handleMouseDown() {
    // Define outline element
    let outlineElements = this.shadowRoot.querySelectorAll('.add_outline');

    // Loop through the array of outline element until they are all gone
    while (outlineElements.length > 0) {
      // Remove outline
      outlineElements[0].classList.add('remove_outline');

      // Remove outline class
      outlineElements[0].classList.remove('add_outline');

      // Update list
      outlineElements = this.shadowRoot.querySelectorAll('.add_outline');
    }
  }

  // it's possible that these events have to be extended to the window 
  // (if the user should be able to drag outside the picker container)
  _rootMouseMove(event) {
    this.hueSlider.handleMouseMove(event);
    this.opacitySlider.handleMouseMove(event);
    this.saturationLightnessBox.handleMouseMove(event);
  }

  _rootMouseUp(event) {
    this.hueSlider.handleMouseUp(event);
    this.opacitySlider.handleMouseUp(event);
    this.saturationLightnessBox.handleMouseUp(event);
  }

  _rootTouchMoveevent(event) {
    this.hueSlider.handleTouchMove(event);
    this.opacitySlider.handleTouchMove(event);
    this.saturationLightnessBox.handleTouchMove(event);
  }

  _rootTouchEnd(event) {
    this.hueSlider.handleTouchEnd(event);
    this.opacitySlider.handleTouchEnd(event);
    this.saturationLightnessBox.handleTouchEnd(event);
  }

  _handleHueUpdate(event) {
    if (event.detail.position === null) {
      console.error(`${Static.component}._handleHueUpdate, invalid event`, event);
      return;
    }

    // Defining the X position
    let eventX = event.detail.position - this.colorSliderContainer.getBoundingClientRect().left;

    // Making conditions so that the user don't drag outside the box
    if (eventX < 11) eventX = 11;

    if (eventX > 255) eventX = 255;

    // Updating the X property of the dragger
    this.colorSliderDragger.attributes.x.nodeValue = eventX;

    // Percentage of the dragger on the X axis
    const percent = ((eventX - 11) / 244) * 100;

    // Calculating the color
    // Max number for hue colors is 359, I find the percentage of this, from the percent variable
    // I take it away from the max number because the slider should work backwards
    const HColor = Math.round(359 - (359 / 100) * percent);

    // Updating the Hue value in the data object
    this.hue = HColor;

    // Update the color text values
    this.UpdatePicker.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this.setAttribute('data-color', 'color');

    // Update
    this.updatePicker();
  }

  _handleOpacityUpdate(event) {
    if (event.detail.alpha === null || event.detail.alphaX === null ) {
      console.error(`${Static.component}._handleOpacityUpdate, invalid event`, event);
      return;
    }

    this.alpha = event.detail.alpha;
    this.alphaX = event.detail.alphaX;

    // Update the color text values
    this.UpdatePicker.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this.setAttribute('data-color', 'color');

    // Update
    this.updatePicker();
  }

  _handleSaturationLightnessUpdate(event) {
    if (event.detail.saturation === null || event.detail.lightness === null) {
      console.error(`${Static.component}._handleSaturationLightnessUpdate, invalid event`, event);
      return;
    }

    // Applying the Saturation and Lightness to the data object
    this.saturation = event.detail.saturation;
    this.lightness = event.detail.lightness;

    // Update the color text values
    this.UpdatePicker.updateColorValueInput();

    // Setting the data-color attribute to a color string
    // This is so that the color updates properly on instances where the color has not been set
    this.setAttribute('data-color', 'color');

    // Update
    this.updatePicker();
  }

  _handleCustomColorsSelect(event) {
    if (event.detail.color === null) {
      console.error(`${Static.component}._handleCustomColorsSelect, invalid event`, event);
      return;
    }

    // Updating the picker with that color
    this.UpdatePicker.updateColorDisplays(event.detail.color);

    // Update
    this.updatePicker();
  }

  _getTemplate() {
    return html`
      <div class="wc-colr-pickr" 
        @mousedown=${this._handleMouseDown}
        @mousemove=${this._rootMouseMove}
        @mouseup=${this._rootMouseUp}
        @touchmove=${this._rootTouchMoveevent}
        @touchend=${this._rootTouchEnd}
      >
        <!-- Add a button to your HTML document and give it any ID -->
        <button id="toggle_pickr"
          data-color="${this.selectedColor}"
          style="background-color: ${this.selectedColor}" 
          @click="${this._togglePicker}"
        ></button>
        <aside id="color_picker" class="picker-container">
          <div class="picker-main">
            <saturation-lightness-box
              @saturation-lightness-update=${this._handleSaturationLightnessUpdate}
              alpha="${this.alpha}"
              hue="${this.hue}"
              boxx="${this.boxX}"
              boxy="${this.boxY}"
            >
            </saturation-lightness-box>
            <div id="sliders">
              <hue-slider 
                @hue-update=${this._handleHueUpdate} 
                huex="${this.hueX}">
              </hue-slider>
              <opacity-slider 
                @opacity-update=${this._handleOpacityUpdate} 
                alphax="${this.alphaX}">
              </opacity-slider>
            </div>
            <div id="color_text_values" tabindex="0">
              <div id="hexa">
                <input id="hex_input" name="hex_input" type="text" maxlength="9" spellcheck="false" 
                  @blur=${this.ColorTextValues.handleHexBlur}
                />
                <br />
                <label for="hex_input" class="label_text">HEX</label>
              </div>
              <div id="rgba" style="display: none">
                <div class="rgba_divider">
                  <input class="rgba_input" name="r" type="number" min="0" max="255" 
                    @change=${this.ColorTextValues.handleRgbaChange}
                  />
                  <br />
                  <label for="r" class="label_text">R</label>
                </div>
                <div class="rgba_divider">
                  <input class="rgba_input" name="g" type="number" min="0" max="255" 
                    @change=${this.ColorTextValues.handleRgbaChange}
                  />
                  <br />
                  <label for="g" class="label_text">G</label>
                </div>
                <div class="rgba_divider">
                  <input class="rgba_input" name="b" type="number" min="0" max="255" 
                    @change=${this.ColorTextValues.handleRgbaChange}
                  />
                  <br />
                  <label for="b" class="label_text">B</label>
                </div>
                <div class="rgba_divider">
                  <input class="rgba_input" name="a" type="number" step="0.1" min="0" max="1" 
                    @change=${this.ColorTextValues.handleRgbaChange}
                  />
                  <br />
                  <label for="a" class="label_text">A</label>
                </div>
              </div>
              <div id="hsla" style="display: none">
                <div class="hsla_divider">
                  <input class="hsla_input" name="h" type="number" min="0" max="359"
                    @change=${this.ColorTextValues.handleHslaChange}
                  />
                  <br />
                  <label for="h" class="label_text">H</label>
                </div>
                <div class="hsla_divider">
                  <input class="hsla_input" name="s" type="number" min="0" max="100"
                    @change=${this.ColorTextValues.handleHslaChange}
                  />
                  <br />
                  <label for="s" class="label_text">S%</label>
                </div>
                <div class="hsla_divider">
                  <input class="hsla_input" name="l" type="number" min="0" max="100"
                    @change=${this.ColorTextValues.handleHslaChange}
                  />
                  <br />
                  <label for="l" class="label_text">L%</label>
                </div>
                <div class="rgba_divider">
                  <input class="hsla_input" name="a" type="number" step="0.1" min="0" max="1"
                    @change=${this.ColorTextValues.handleHslaChange}
                  />
                  <br />
                  <label for="a" class="label_text">A</label>
                </div>
              </div>
              <button id="switch_color_type" class="remove_outline" name="switch-color-type"
                @mousedown=${this.ColorTextValues.switchColorType}
              >
                <svg viewBox="0 -2 24 24" width="20" height="20">
                  <path fill="#555" d="M6 11v-4l-6 5 6 5v-4h12v4l6-5-6-5v4z" />
                </svg>
              </button>
            </div>
          </div>
          <custom-colors
            @custom-colors-select=${this._handleCustomColorsSelect}
            hue="${this.hue}"
            saturation="${this.saturation}"
            lightness="${this.lightness}"
            alpha="${this.alpha}"
          >
          </custom-colors>
        </aside>
      </div>
    `;
  }
}
window.customElements.define('wc-colr-pickr', WCColrPickr);
