# wc-colr-pickr

WCColrPickr web component.

## Properties

| Property             | Type      | Default  |
| -------------------- | --------- | -------- |
| `LSCustomColors`     | `object`  | {"0":[]} |
| `alpha`              | `number`  | 1        |
| `boxStatus`          | `boolean` | false    |
| `boxStatusTouch`     | `boolean` | false    |
| `colorTypeStatus`    | `string`  | "HEXA"   |
| `contextMenuElem`    |           | null     |
| `doubleTapTime`      | `number`  | 0        |
| `hue`                | `number`  | 0        |
| `instance`           |           | null     |
| `lightness`          | `number`  | 50       |
| `listeners`          | `never[]` | []       |
| `opacityStatus`      | `boolean` | false    |
| `opacityStatusTouch` | `boolean` | false    |
| `pickerOpen`         | `boolean` | false    |
| `saturation`         | `number`  | 100      |
| `sliderStatus`       | `boolean` | false    |
| `sliderStatusTouch`  | `boolean` | false    |

## Methods

| Method                            | Type                 | Description                                                                                                                                                                                                                    |
| --------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `addEventListenersFromAttributes` | `(): void`           | Adds any event listeners defined with the data-action attribute defined on elements inside your template.<br />Example: <div data-action="click:handleClick"> will listen for the click event with this.handleClick as target. |
| `adoptedCallback`                 | `(): void`           | Invoked when the custom element is moved to a new document                                                                                                                                                                     |
| `closePicker`                     | `(): void`           |                                                                                                                                                                                                                                |
| `initPickR`                       | `(): void`           |                                                                                                                                                                                                                                |
| `keyShortcuts`                    | `(event: any): void` |                                                                                                                                                                                                                                |
| `updateColorDisplays`             | `(color: any): void` |                                                                                                                                                                                                                                |
| `updateColorValueInput`           | `(): void`           |                                                                                                                                                                                                                                |
| `updatePicker`                    | `(): void`           |                                                                                                                                                                                                                                |
