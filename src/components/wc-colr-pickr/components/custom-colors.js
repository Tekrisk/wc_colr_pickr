import { LitElement, html } from 'lit-element';

export class CustomColors extends LitElement {
  static get properties() {
    return {
      ccChange: { type: Number },
      hue: { type: Number },
      saturation: { type: Number },
      lightness: { type: Number },
      alpha: { type: Number },
    };
  }

  // read from ls
  get customColors() {
    return JSON.parse(localStorage.getItem('colrpickr_custom_colors'));
  }

  // update ls
  set customColors(updateCustomColors) {
    localStorage.setItem('colrpickr_custom_colors', JSON.stringify(updateCustomColors));
  }

  constructor() {
    super();
    this.contextMenuElem = null;
    this.addCustomColor = this.addCustomColor.bind(this);
    this.contextCustomColor = this.contextCustomColor.bind(this);
    this.clearSingleCustomColor = this.clearSingleCustomColor.bind(this);
    this.clearAllCustomColors = this.clearAllCustomColors.bind(this);
    this.selectCustomColor = this.selectCustomColor.bind(this);
  }

  // disable shadowRoot for these subcomponents
  createRenderRoot() {
    return this;
  }

  render() {
    return this._getTemplate();
  }

  setCCChange() {
    this.ccChange = this.ccChange ? this.ccChange + 1 : 1;
  }

  // Function to add a new custom color
  addCustomColor() {
    // Getting the color
    const color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
    const customColors = Object.assign({}, this.customColors);
    // Pushing the color to the top of the array
    customColors[0].unshift({ value: color });
    // Updating the local storage with the new custom color
    this.customColors = customColors;
    this.setCCChange();
  }

  // Clears a selected custom color
  clearSingleCustomColor() {
    const customColors = { 0: [] };

    // Looping through the custom colors to repopulate the variable
    for (let x in this.querySelectorAll('.custom_colors_preview')) {
      // Continuing if its a number
      if (isNaN(x) === true) {
        continue;
      }

      // Pushing the colors to the array
      let el = this.querySelectorAll('.custom_colors_preview')[x];
      customColors[0].push({
        value: el.getAttribute('data-custom-color'),
        title: el.getAttribute('title'),
      });
    }

    this.customColors = customColors;

    // Making sure the add color button is displaying
    this.querySelector('#custom_colors_add').style.display = 'inline-block';
    this.setCCChange();
  }

  // Clears all custom colors
  clearAllCustomColors() {
    // Looping through the custom colors to repopulate the variable
    while (this.querySelectorAll('.custom_colors_preview').length > 0) {
      this.querySelector('#custom_colors_box').removeChild(this.querySelector('.custom_colors_preview'));
    }

    // Clearing ls
    this.customColors = { 0: [] };

    // Making sure the add color button is displaying
    this.querySelector('#custom_colors_add').style.display = 'inline-block';
    this.setCCChange();
  }

  selectCustomColor(event) {
    // Making sure the users has selected a color preview
    if (event.target.className === 'custom_colors_preview') {
      // Color
      const color = event.target.getAttribute('data-custom-color');
      const cEvent = new CustomEvent('custom-colors-select', {
        detail: { color }
      });
      this.dispatchEvent(cEvent);
    }
  }

  contextCustomColor(event) {
    // Making sure the users has selected a color preview
    if (event.target.className === 'custom_colors_preview') {
      // Preventing default
      event.preventDefault();

      // Defining the context menu
      const contextMenu = this.querySelector('#color_context_menu');

      // Updating the styling of the menu
      contextMenu.style.display = 'block';
      contextMenu.style.top = event.target.getBoundingClientRect().top + 25 + 'px';
      contextMenu.style.left = event.target.getBoundingClientRect().left + 'px';

      // Defining the color selected
      this.contextMenuElem = event.target;
    }
  }

  _getTemplate() {
    return html`
      <div id="custom_colors" class="picker-custom-colors">
        <div id="custom_colors_header">
          <svg id="custom_colors_pallet_icon" viewBox="0 0 24 24" width="15" height="18">
            <path
              fill="#555"
              d="M4 21.832c4.587.38 2.944-4.493 7.188-4.538l1.838 1.534c.458 5.538-6.315 6.773-9.026 3.004zm14.065-7.115c1.427-2.239 5.847-9.749 5.847-9.749.352-.623-.43-1.273-.976-.813 0 0-6.572 5.714-8.511 7.525-1.532 1.432-1.539 2.086-2.035 4.447l1.68 1.4c2.227-.915 2.868-1.039 3.995-2.81zm-11.999 3.876c.666-1.134 1.748-2.977 4.447-3.262.434-2.087.607-3.3 2.547-5.112 1.373-1.282 4.938-4.409 7.021-6.229-1-2.208-4.141-4.023-8.178-3.99-6.624.055-11.956 5.465-11.903 12.092.023 2.911 1.081 5.571 2.82 7.635 1.618.429 2.376.348 3.246-1.134zm6.952-15.835c1.102-.006 2.005.881 2.016 1.983.004 1.103-.882 2.009-1.986 2.016-1.105.009-2.008-.88-2.014-1.984-.013-1.106.876-2.006 1.984-2.015zm-5.997 2.001c1.102-.01 2.008.877 2.012 1.983.012 1.106-.88 2.005-1.98 2.016-1.106.007-2.009-.881-2.016-1.988-.009-1.103.877-2.004 1.984-2.011zm-2.003 5.998c1.106-.007 2.01.882 2.016 1.985.01 1.104-.88 2.008-1.986 2.015-1.105.008-2.005-.88-2.011-1.985-.011-1.105.879-2.004 1.981-2.015zm10.031 8.532c.021 2.239-.882 3.718-1.682 4.587l-.046.044c5.255-.591 9.062-4.304 6.266-7.889-1.373 2.047-2.534 2.442-4.538 3.258z"
            />
          </svg>
          <button id="custom_colors_add" class="remove_outline" name="add-a-custom-color"
            @mousedown=${this.addCustomColor}
          >
            <svg viewBox="0 -2 24 24" width="14" height="16">
              <path fill="#555" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
            </svg>
          </button>
        </div>
        <div id="custom_colors_box" 
          @mousedown=${this.selectCustomColor} 
          @contextmenu=${this.contextCustomColor}
          data-ccchange="${this.ccChange}"
        >
          ${this.customColors[0].map(
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
          @mousedown=${this.clearSingleCustomColor}
        >
          Remove
        </button>
        <button id="color_clear_all" class="color_ctx_menu" name="remove-all-colors"
          @mousedown=${this.clearAllCustomColors}
        >
          Remove All
        </button>
      </div>
    `;
  }
}
window.customElements.define('custom-colors', CustomColors);
