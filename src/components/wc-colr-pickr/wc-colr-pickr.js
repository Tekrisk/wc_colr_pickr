import html from './wc-colr-pickr.html';
import scss from './wc-colr-pickr.scss';
import ColorChangeEvent from './mixins/color-change-event';
import ColorTextValues from './mixins/color-text-values';
import CustomColor from './mixins/custom-color';
import HueSlider from './mixins/hue-slider';
import OpacitySlider from './mixins/opacity-slider';
import SaturationLightnessBox from './mixins/saturation-lightness-box';
import UpdatePicker from './mixins/update-picker';

/**
 * Private properties used inside the module.
 * @type {Object}
 */
const Static = {
  elementInstance: 0,
  component: 'wc-colr-pickr',
  htmlText: html,
  cssText: `<style>${scss}</style>`,
  debug: !production,
};
Object.seal(Static);

/**
 * WCColrPickr web component.
 *
 * @element wc-colr-pickr
 */
export class WCColrPickr extends HTMLElement {
  /**
   * Creates an instance of WCColrPickr.
   * @memberof WCColrPickr
   */
  constructor() {
    super();
    Static.elementInstance++;
    this.attachShadow({ mode: 'open' });
    this.listeners = [];

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
    this.LSCustomColors = { 0: [
      {
        'value': 'red',
      }, {
        'value': 'blue',
      }, {
        'value': 'green',
      }, {
        'value': 'yellow',
      }, {
        'value': 'purple',
      }, {
        'value': 'orange',
      }, {
        'value': 'lime',
      }
    ] };
    UpdatePicker._this = this;
    SaturationLightnessBox._this = this;
    OpacitySlider._this = this;
    ColorChangeEvent._this = this;
    CustomColor._this = this;
    ColorTextValues._this = this;
    HueSlider._this = this;
  }

  updateColorDisplays(color) {
    UpdatePicker.updateColorDisplays(color);
  }

  updateColorValueInput() {
    UpdatePicker.updateColorValueInput();
  }

  /**
   * Invoked when the custom element is first connected to the document's DOM
   * @memberof WCColrPickr
   */
  connectedCallback() {
    // add css and html to the shadowRoot
    this.shadowRoot.innerHTML = Static.cssText + Static.htmlText;

    // init properties by attributes or set default
    if (Static.debug) {
      console.debug(`${Static.component}.connectedCallback, initialized properties:`);
    }

    // add eventlisteners from attributes
    this.addEventListenersFromAttributes();
    this.initPickR();
    ColorTextValues.connectedCallback();
    CustomColor.connectedCallback();
    HueSlider.connectedCallback();
    OpacitySlider.connectedCallback();
    SaturationLightnessBox.connectedCallback();
  }

  /**
   * Invoked when the custom element is disconnected from the document's DOM
   * @memberof WCColrPickr
   */
  disconnectedCallback() {
    if (Static.debug) {
      console.debug(`${Static.component}.disconnectCallback`);
    }
    this.listeners.forEach((listener) => listener.element.removeEventListener(listener.event, listener.function));
  }

  /**
   * Invoked when the custom element is moved to a new document
   * @memberof WCColrPickr
   */
  adoptedCallback() {
    if (Static.debug) {
      console.debug(`${Static.component}.adoptedCallback`, this);
    }
  }

  /**
   * Invoked each time one of the custom element's attributes is added, removed, or changed.
   * Which attributes to notice change for is specified in a static get observedAttributes method
   * @param {String} attrName
   * @param {String} oldValue
   * @param {String} newValue
   * @memberof WCColrPickr
   */
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue !== newValue && this[attrName]) {
      this[attrName] = newValue;
    }
  }

  /**
   * Specifies which attributes are observed (attributeChangedCallback will only invoked for the specified attributes).
   * @readonly
   * @static
   * @type {[String]}
   * @memberof WCColrPickr
   */
  static get observedAttributes() {
    return [];
  }

  /**
   * Adds any event listeners defined with the data-action attribute defined on elements inside your template.
   * Example: <div data-action="click:handleClick"> will listen for the click event with this.handleClick as target.
   * @memberof WCColrPickr
   */
  addEventListenersFromAttributes() {
    Array.from(this.shadowRoot.querySelectorAll('[data-action]')).forEach((element) => {
      const actions = element.getAttribute('data-action').split(' ');

      actions.forEach((action) => {
        try {
          let targetEvent = action.split(':')[0];
          let targetFunc = action.split(':')[1];

          if (this[targetFunc]) {
            element.addEventListener(targetEvent, this[targetFunc]);
            // add to listeners for removal on disconnect
            this.listeners.push({
              element: element,
              function: this[targetFunc],
              event: targetEvent,
            });
          } else {
            console.error(`${Static.component}.addEventListenersFromAttributes: target function ${targetFunc} is undefined!`);
          }
        } catch (error) {
          console.error(`{Static.component}.addEventListenersFromAttributes failed for element: `, element, action);
        }
      });
    });
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
     
    // Looping through the data to update the DOM with the custom colors
    for (let x = this.LSCustomColors[0].length - 1; x >= 0; x--) {
      // Creating the element
      let customColorElem = document.createElement('BUTTON');
      customColorElem.className = 'custom_colors_preview';
      customColorElem.style.background = this.LSCustomColors[0][x].value;
      customColorElem.setAttribute('data-custom-color', this.LSCustomColors[0][x].value);
      customColorElem.setAttribute(
        'title', 
        this.LSCustomColors[0][x].label ?
        this.LSCustomColors[0][x].value : 
        this.LSCustomColors[0][x].value
      );

      // Placing the element in the DOM
      this.shadowRoot.getElementById('custom_colors_box').appendChild(customColorElem);
    }

    // Adding the object to the elements object
    this.colorPickerObj = this;
    this.button = this.shadowRoot.getElementById('toggle_pickr');

    // Setting color value as a data attribute and changing elements color if color param is given
    this.button.setAttribute('data-color', '#ff0000');
    this.button.style.background = '#ff0000';

    // Click listener to have the button open the color picker interface
    this.button.addEventListener('click', () => {
      // Update state
      this.pickerOpen = true;

      // Define picker
      const picker = this.shadowRoot.getElementById('color_picker');

      // Displaying the color picker
      picker.style.display = 'grid';

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
      this.updateColorDisplays(this.button.getAttribute('data-color'));

      // Focus on a picker item
      this.shadowRoot.getElementById('color_text_values').focus();

      picker.addEventListener('keydown', this.keyShortcuts.bind(this));
    });

    // Remove outline from tabbing
    this.shadowRoot.querySelector('.wc-colr-pickr').addEventListener('mousedown', () => {
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
    });

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
    ColorChangeEvent.colorChange({
      h: this.hue,
      s: this.saturation,
      l: this.lightness,
      a: this.alpha,
    });
  }
}
window.customElements.define('wc-colr-pickr', WCColrPickr);
