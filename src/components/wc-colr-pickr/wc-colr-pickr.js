import { LitElement, html, css } from 'lit-element';
import scss from './wc-colr-pickr.scss';
import { ColorChangeEvent } from './mixins/color-change-event';
import { ColorTextValues } from './mixins/color-text-values';
import { CustomColor } from './mixins/custom-color';
import { HueSlider } from './mixins/hue-slider';
import { OpacitySlider } from './mixins/opacity-slider';
import { SaturationLightnessBox } from './mixins/saturation-lightness-box';
import { UpdatePicker } from './mixins/update-picker';

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

  /**
   * Creates an instance of WCColrPickr.
   * @memberof WCColrPickr
   */
  constructor() {
    super();
    Static.elementInstance++;

    this.selectedColor = '#ff0000';
    this.pickerOpen = false;
    this.instance = null;
    this.boxStatus = false;
    this.boxStatusTouch = false;
    this.sliderStatus = false;
    this.sliderStatusTouch = false;
    this.opacityStatus = false;
    this.opacityStatusTouch = false;
    this.colorTypeStatus = 'HEXA';
    this.hue = 0;
    this.saturation = 100;
    this.lightness = 50;
    this.alpha = 1;
    this.contextMenuElem = null;
    this.doubleTapTime = 0;
    this.LSCustomColors = {
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
    this.SaturationLightnessBox = new SaturationLightnessBox(this);
    this.OpacitySlider = new OpacitySlider(this);
    this.ColorChangeEvent = new ColorChangeEvent(this);
    this.CustomColor = new CustomColor(this);
    this.ColorTextValues = new ColorTextValues(this);
    this.HueSlider = new HueSlider(this);
    this._togglePicker = this._togglePicker.bind(this);
    this._rootMouseMove = this._rootMouseMove.bind(this);
    this._rootMouseUp = this._rootMouseUp.bind(this);
    this._rootTouchMove = this._rootTouchMove.bind(this);
    this._rootTouchEnd = this._rootTouchEnd.bind(this);
  }

  // Render element DOM by returning a `lit-html` template.
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
    if (localStorage.getItem('custom_colors') === null) {
      // If not then I set one
      localStorage.setItem('custom_colors', JSON.stringify(this.LSCustomColors));
    } else {
      // If it has then I define the LSCustomColors with the value for this
      this.LSCustomColors = JSON.parse(localStorage.getItem('custom_colors'));
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
      // Define the target
      let target = event.target;
      // close if picker is open and target is picker tag...
      if (this.pickerOpen && target.tagName !== 'WC-COLR-PICKR') {
        this.closePicker();
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

  handleMouseDown() {
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

  _rootMouseMove(event) {
    this.HueSlider.handleMouseMove(event);
    this.OpacitySlider.handleMouseMove(event);
    this.SaturationLightnessBox.handleMouseMove(event);
  }

  _rootMouseUp(event) {
    this.HueSlider.handleMouseUp(event);
    this.OpacitySlider.handleMouseUp(event);
    this.SaturationLightnessBox.handleMouseUp(event);
  }

  _rootTouchMove(event) {
    this.HueSlider.handleTouchMove(event);
    this.OpacitySlider.handleTouchMove(event);
    this.SaturationLightnessBox.handleTouchMove(event);
  }

  _rootTouchEnd(event) {
    this.HueSlider.handleTouchEnd(event);
    this.OpacitySlider.handleTouchEnd(event);
    this.SaturationLightnessBox.handleTouchEnd(event);
  }

  _getTemplate() {
    return html`
      <div class="wc-colr-pickr" 
        @mousedown=${this.handleMouseDown}
        @mousemove=${this._rootMouseMove}
        @mouseup=${this._rootMouseUp}
        @touchmove=${this._rootTouchMove}
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
            <svg id="color_box" width="263" height="130"
              @mousedown=${this.SaturationLightnessBox.handleMouseDown}
              @touchstart=${this.SaturationLightnessBox.handleTouchStart}
            >
              <defs>
                <linearGradient id="saturation" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#fff"></stop>
                  <stop offset="100%" stop-color="hsl(0,100%,50%)"></stop>
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
              <svg id="box_dragger" x="336" y="14" style="overflow: visible">
                <circle r="9" fill="none" stroke="#000" stroke-width="2"></circle>
                <circle r="7" fill="none" stroke="#fff" stroke-width="2"></circle>
              </svg>
            </svg>
            <div id="sliders">
              <svg id="color_slider" width="263" height="20" 
                @mousedown=${this.HueSlider.handleMouseDown}
                @touchstart=${this.HueSlider.handleTouchStart}
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
                <svg id="color_slider_dragger" x="277" y="11" style="overflow: visible">
                  <circle r="7" fill="none" stroke="#000" stroke-width="2"></circle>
                  <circle r="5" fill="none" stroke="#fff" stroke-width="2"></circle>
                </svg>
              </svg>
              <svg id="opacity_slider" width="263" height="20"
                @mousedown=${this.OpacitySlider.handleMouseDown}
                @touchstart=${this.OpacitySlider.handleTouchStart}
              >
                <defs>
                  <linearGradient id="opacity" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#000"></stop>
                    <stop offset="100%" stop-color="#fff"></stop>
                  </linearGradient>
                </defs>
                <rect rx="5" ry="5" x="1" y="6" width="263" height="10" stroke="#fff" stroke-width="2" fill="url(#opacity)"></rect>
                <svg id="opacity_slider_dragger" x="277" y="11" style="overflow: visible">
                  <circle r="7" fill="none" stroke="#000" stroke-width="2"></circle>
                  <circle r="5" fill="none" stroke="#fff" stroke-width="2"></circle>
                </svg>
              </svg>
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
          <div id="custom_colors" class="picker-custom-colors">
            <div id="custom_colors_header">
              <svg id="custom_colors_pallet_icon" viewBox="0 0 24 24" width="15" height="18">
                <path
                  fill="#555"
                  d="M4 21.832c4.587.38 2.944-4.493 7.188-4.538l1.838 1.534c.458 5.538-6.315 6.773-9.026 3.004zm14.065-7.115c1.427-2.239 5.847-9.749 5.847-9.749.352-.623-.43-1.273-.976-.813 0 0-6.572 5.714-8.511 7.525-1.532 1.432-1.539 2.086-2.035 4.447l1.68 1.4c2.227-.915 2.868-1.039 3.995-2.81zm-11.999 3.876c.666-1.134 1.748-2.977 4.447-3.262.434-2.087.607-3.3 2.547-5.112 1.373-1.282 4.938-4.409 7.021-6.229-1-2.208-4.141-4.023-8.178-3.99-6.624.055-11.956 5.465-11.903 12.092.023 2.911 1.081 5.571 2.82 7.635 1.618.429 2.376.348 3.246-1.134zm6.952-15.835c1.102-.006 2.005.881 2.016 1.983.004 1.103-.882 2.009-1.986 2.016-1.105.009-2.008-.88-2.014-1.984-.013-1.106.876-2.006 1.984-2.015zm-5.997 2.001c1.102-.01 2.008.877 2.012 1.983.012 1.106-.88 2.005-1.98 2.016-1.106.007-2.009-.881-2.016-1.988-.009-1.103.877-2.004 1.984-2.011zm-2.003 5.998c1.106-.007 2.01.882 2.016 1.985.01 1.104-.88 2.008-1.986 2.015-1.105.008-2.005-.88-2.011-1.985-.011-1.105.879-2.004 1.981-2.015zm10.031 8.532c.021 2.239-.882 3.718-1.682 4.587l-.046.044c5.255-.591 9.062-4.304 6.266-7.889-1.373 2.047-2.534 2.442-4.538 3.258z"
                />
              </svg>
              <button id="custom_colors_add" class="remove_outline" name="add-a-custom-color"
                @mousedown=${this.CustomColor.addCustomColor}
              >
                <svg viewBox="0 -2 24 24" width="14" height="16">
                  <path fill="#555" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                </svg>
              </button>
            </div>
            <div id="custom_colors_box" 
              @mousedown=${this.CustomColor.selectCustomColor} 
              @contextmenu=${this.CustomColor.contextCustomColor}
            >
              ${this.LSCustomColors[0].map(
                (color) =>
                  html`<button                  
                    class="custom_colors_preview"
                    style="background-color: ${color.value};"
                    data-custom-color="${color.value}"
                    title="${color.label ? color.label + ' (' + color.value + ')' : color.value}"
                  ></button>`
              )}
            </div>
          </div>
          <div id="color_context_menu" class="color_ctx_menu">
            <button id="color_clear_single" class="color_ctx_menu" name="remove-single-color"
              @mousedown=${this.CustomColor.clearSingleCustomColor}
            >
              Remove
            </button>
            <button id="color_clear_all" class="color_ctx_menu" name="remove-all-colors"
              @mousedown=${this.CustomColor.clearAllCustomColors}
            >
              Remove All
            </button>
          </div>
        </aside>
      </div>
    `;
  }
}
window.customElements.define('wc-colr-pickr', WCColrPickr);
