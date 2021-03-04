# wc-colr-pickr

WCColrPickr web component.

## Properties

| Property             | Attribute       | Modifiers | Type                  | Default                                          |
|----------------------|-----------------|-----------|-----------------------|--------------------------------------------------|
| `LSCustomColors`     |                 |           | `object`              | {"0":[{"value":"red"},{"value":"blue"},{"value":"green"},{"value":"yellow"},{"value":"purple"},{"value":"orange"},{"value":"lime"}]} |
| `alpha`              |                 |           | `number`              | 1                                                |
| `boxStatus`          |                 |           | `boolean`             | false                                            |
| `boxStatusTouch`     |                 |           | `boolean`             | false                                            |
| `button`             |                 | readonly  | `HTMLElement \| null` |                                                  |
| `colorTypeStatus`    |                 |           | `string`              | "HEXA"                                           |
| `contextMenuElem`    |                 |           |                       | null                                             |
| `doubleTapTime`      |                 |           | `number`              | 0                                                |
| `hue`                |                 |           | `number`              | 0                                                |
| `initialized`        |                 |           | `boolean`             | false                                            |
| `instance`           |                 |           |                       | null                                             |
| `lightness`          |                 |           | `number`              | 50                                               |
| `opacityStatus`      |                 |           | `boolean`             | false                                            |
| `opacityStatusTouch` |                 |           | `boolean`             | false                                            |
| `pickerOpen`         |                 |           | `boolean`             | false                                            |
| `saturation`         |                 |           | `number`              | 100                                              |
| `selectedColor`      | `selectedColor` |           | `string`              | "#ff0000"                                        |
| `sliderStatus`       |                 |           | `boolean`             | false                                            |
| `sliderStatusTouch`  |                 |           | `boolean`             | false                                            |

## Methods

| Method                  | Type                 | Description                                      |
|-------------------------|----------------------|--------------------------------------------------|
| `adoptedCallback`       | `(): void`           | Invoked when the custom element is moved to a new document |
| `closePicker`           | `(): void`           |                                                  |
| `handleMouseDown`       | `(): void`           |                                                  |
| `initPickR`             | `(): void`           |                                                  |
| `keyShortcuts`          | `(event: any): void` |                                                  |
| `updateColorDisplays`   | `(color: any): void` |                                                  |
| `updateColorValueInput` | `(): void`           |                                                  |
| `updatePicker`          | `(): void`           |                                                  |
