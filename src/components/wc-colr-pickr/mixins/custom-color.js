const CustomColor = {
  _this: null,

  // Function to add a new custom color
  addCustomColor: function() {
    // Limiting a custom color to two rows
    if (this._this.LSCustomColors[0].length === 19) {
      this._this.shadowRoot.getElementById('custom_colors_add').style.display = 'none';
    }

    // Getting the color
    const color = `hsla(${this._this.hue}, ${this._this.saturation}%, ${this._this.lightness}%, ${this._this.alpha})`;

    // Creating the element
    let customColorElem = document.createElement('BUTTON');
    customColorElem.className = 'custom_colors_preview';
    customColorElem.style.background = color;
    customColorElem.setAttribute('data-custom-color', color);
    // Placing the element in the DOM
    this._this.shadowRoot.getElementById('custom_colors_box').appendChild(customColorElem);

    // Pushing the color to the top of the array
    this._this.LSCustomColors[0].unshift(color);

    // Updating the local storage with the new custom color
    localStorage.setItem('custom_colors', JSON.stringify(this._this.LSCustomColors));
  },

  // Clears a selected custom color
  clearSingleCustomColor: function(element) {
    const elemToRemove = element === undefined ? this._this.contextMenuElem : element;

    // Removing the element
    this._this.shadowRoot.getElementById('custom_colors_box').removeChild(elemToRemove);

    // Clearing the variable
    this._this.LSCustomColors = { 0: [] };

    // Looping through the custom colors to repopulate the variable
    for (let x in this._this.shadowRoot.querySelectorAll('.custom_colors_preview')) {
      // Continuing if its a number
      if (isNaN(x) === true) {
        continue;
      }

      // Pushing the colors to the array
      this._this.LSCustomColors[0].push(this._this.shadowRoot.querySelectorAll('.custom_colors_preview')[x].getAttribute('data-custom-color'));
    }

    // Updating the local storage
    localStorage.setItem('custom_colors', JSON.stringify(this._this.LSCustomColors));

    // Making sure the add color button is displaying
    this._this.shadowRoot.getElementById('custom_colors_add').style.display = 'inline-block';
  },

  // Clears all custom colors
  clearAllCustomColors: function() {
    // Clearing variable
    this._this.LSCustomColors = { 0: [] };

    // Looping through the custom colors to repopulate the variable
    while (this._this.shadowRoot.querySelectorAll('.custom_colors_preview').length > 0) {
      this._this.shadowRoot.getElementById('custom_colors_box').removeChild(this._this.shadowRoot.querySelectorAll('.custom_colors_preview')[0]);
    }

    // Updating the local storage
    localStorage.setItem('custom_colors', JSON.stringify(this._this.LSCustomColors));

    // Making sure the add color button is displaying
    this._this.shadowRoot.getElementById('custom_colors_add').style.display = 'inline-block';
  },

  connectedCallback: function() {
    // Click on color listener to update the picker
    this._this.shadowRoot.getElementById('custom_colors_box').addEventListener('click', (event) => {
      // Making sure the users has selected a color preview
      if (event.target.className === 'custom_colors_preview') {
        // Color
        const color = event.target.getAttribute('data-custom-color');

        // Updating the picker with that color
        this._this.updateColorDisplays(color);

        // Update
        this._this.updatePicker();
      }
    });

    this._this.shadowRoot.getElementById('custom_colors_add').addEventListener('click', () => {
      this.addCustomColor();
    });

    // Event to fire for a context menu
    this._this.shadowRoot.getElementById('custom_colors_box').addEventListener('contextmenu', (event) => {
      // Making sure the users has selected a color preview
      if (event.target.className === 'custom_colors_preview') {
        // Preventing default
        event.preventDefault();

        // Defining the context menu
        const contextMenu = this._this.shadowRoot.getElementById('color_context_menu');

        // Updating the styling of the menu
        contextMenu.style.display = 'block';
        contextMenu.style.top = event.target.getBoundingClientRect().top + 25 + 'px';
        contextMenu.style.left = event.target.getBoundingClientRect().left + 'px';

        // Defining the color selected
        this._this.contextMenuElem = event.target;
      }
    });

    this._this.shadowRoot.getElementById('color_clear_single').addEventListener('mousedown', () => {
      this.clearSingleCustomColor();
    });

    this._this.shadowRoot.getElementById('color_clear_all').addEventListener('mousedown', () => {
      this.clearAllCustomColors();
    });
  }
}

export default CustomColor;