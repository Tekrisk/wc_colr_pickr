export class CustomColor {
  constructor(_component) {
    this._component = _component;
    this.addCustomColor = this.addCustomColor.bind(this);
    this.contextCustomColor = this.contextCustomColor.bind(this);
    this.clearSingleCustomColor = this.clearSingleCustomColor.bind(this);
    this.clearAllCustomColors = this.clearAllCustomColors.bind(this);
    this.selectCustomColor = this.selectCustomColor.bind(this);
  }

  // Function to add a new custom color
  addCustomColor() {
    // Getting the color
    const color = `hsla(${this._component.hue}, ${this._component.saturation}%, ${this._component.lightness}%, ${this._component.alpha})`;

    // Creating the element
    let customColorElem = document.createElement('BUTTON');
    customColorElem.className = 'custom_colors_preview';
    customColorElem.style.background = color;
    customColorElem.setAttribute('data-custom-color', color);
    // Placing the element in the DOM
    this._component.shadowRoot.getElementById('custom_colors_box').appendChild(customColorElem);

    // Pushing the color to the top of the array
    this._component.LSCustomColors[0].unshift({ value: color });

    // Updating the local storage with the new custom color
    localStorage.setItem('custom_colors', JSON.stringify(this._component.LSCustomColors));
  }

  // Clears a selected custom color
  clearSingleCustomColor(_element) {
    const elemToRemove = _element === undefined ? this._component.contextMenuElem : _element;

    // Removing the element
    this._component.shadowRoot.getElementById('custom_colors_box').removeChild(elemToRemove);

    // Clearing the variable
    this._component.LSCustomColors = { 0: [] };

    // Looping through the custom colors to repopulate the variable
    for (let x in this._component.shadowRoot.querySelectorAll('.custom_colors_preview')) {
      // Continuing if its a number
      if (isNaN(x) === true) {
        continue;
      }

      // Pushing the colors to the array
      let el = this._component.shadowRoot.querySelectorAll('.custom_colors_preview')[x];
      this._component.LSCustomColors[0].push({
        value: el.getAttribute('data-custom-color'),
        title: el.getAttribute('title'),
      });
    }

    // Updating the local storage
    localStorage.setItem('custom_colors', JSON.stringify(this._component.LSCustomColors));

    // Making sure the add color button is displaying
    this._component.shadowRoot.getElementById('custom_colors_add').style.display = 'inline-block';
  }

  // Clears all custom colors
  clearAllCustomColors() {
    // Clearing variable
    this._component.LSCustomColors = { 0: [] };

    // Looping through the custom colors to repopulate the variable
    while (this._component.shadowRoot.querySelectorAll('.custom_colors_preview').length > 0) {
      this._component.shadowRoot.getElementById('custom_colors_box').removeChild(this._component.shadowRoot.querySelectorAll('.custom_colors_preview')[0]);
    }

    // Updating the local storage
    localStorage.setItem('custom_colors', JSON.stringify(this._component.LSCustomColors));

    // Making sure the add color button is displaying
    this._component.shadowRoot.getElementById('custom_colors_add').style.display = 'inline-block';
  }

  selectCustomColor(event) {
    console.error(this, event.target.getAttribute('data-custom-color'));
    // Making sure the users has selected a color preview
    if (event.target.className === 'custom_colors_preview') {
      // Color
      const color = event.target.getAttribute('data-custom-color');

      // Updating the picker with that color
      this._component.UpdatePicker.updateColorDisplays(color);

      // Update
      this._component.updatePicker();
    }
  }

  contextCustomColor(event) {
    // Making sure the users has selected a color preview
    if (event.target.className === 'custom_colors_preview') {
      // Preventing default
      event.preventDefault();

      // Defining the context menu
      const contextMenu = this._component.shadowRoot.getElementById('color_context_menu');

      // Updating the styling of the menu
      contextMenu.style.display = 'block';
      contextMenu.style.top = event.target.getBoundingClientRect().top + 25 + 'px';
      contextMenu.style.left = event.target.getBoundingClientRect().left + 'px';

      // Defining the color selected
      this._component.contextMenuElem = event.target;
    }
  }
}
