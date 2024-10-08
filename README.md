# vue-easy-form

vue-easy-form is a Vue 3 component library that provides easy-to-use, customizable form inputs with built-in formatting and validation.

## Features

- TextInput: Basic text input with customizable styling
- MaskedInput: Input with customizable mask for formatted text entry
- NumberInput: Input for numbers with locale-specific formatting
- DatePicker: Date input with calendar popup for easy date selection
- DateRangePicker: Date range input with calendar popup for selecting start and end dates
- TimePicker: Time input with dropdown for easy time selection

## Installation

```
npm install @reflyh2/vue-easy-form
```

## Usage

First, import and register the components in your Vue 3 application's `main.js` file:

```
import { createApp } from 'vue'
import App from './App.vue'
import VueEasyForm from 'vue-easy-form'

const app = createApp(App)
app.use(VueEasyForm)
app.mount('#app')
```

Then, you can use the components in your Vue templates:

```
<template>
   <MaskedInput v-model="phone" mask="(###) ###-####" />
   <NumberInput v-model="amount" locale="en-US" />
   <DatePicker v-model="date" :min-date="minDate" :max-date="maxDate" />
</template>
```

## Customizing Colors

This library now supports all Tailwind default colors for customization. You can use any color name when setting the mainColor prop on components. For example:

```
<SelectInput v-model="selectedValue" :options="options" mainColor="blue" />
```

Available color names include: slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, and rose.

The default color remains teal if not specified.

## Components

### MaskedInput

A text input with a customizable mask for formatted text entry.

Props:
- `modelValue`: The input value (v-model)
- `mask`: The mask pattern (#: 0-9, A: Alphabets, *: Alphanumeric)
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<MaskedInput v-model="phoneNumber" mask="(###) ###-####" />
```

### NumberInput

An input for numbers with locale-specific formatting.

Props:
- `modelValue`: The input value (v-model)
- `locale`: The locale to use for number formatting (default: 'en-US')
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<NumberInput v-model="amount" locale="en-US" />
```

### DatePicker

A date input with a calendar popup for easy date selection.

Props:
- `modelValue`: The selected date (v-model, in ISO format)
- `locale`: The locale to use for date formatting (default: 'en-US')
- `minDate`: The minimum selectable date (ISO format)
- `maxDate`: The maximum selectable date (ISO format)
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<DatePicker 
   v-model="selectedDate" 
   :min-date="minDate" 
   :max-date="maxDate" />
```

### DateRangePicker

A date range input with a calendar popup for selecting start and end dates.

Props:
- `modelValue`: The selected date range (v-model, an object with `startDate` and `endDate` properties in ISO format)
- `locale`: The locale to use for date formatting (default: 'en-US')
- `minDate`: The minimum selectable date (ISO format)
- `maxDate`: The maximum selectable date (ISO format)
- `customClass`: Custom CSS classes to apply to the input container
- `quickRanges`: An array of quick date range options (optional)

Usage:

```
<DateRangePicker
   v-model="dateRange"
   :min-date="minDate"
   :max-date="maxDate"
   :quick-ranges="quickRangeOptions"
/>

<script>
export default {
   data() {
      return {
         // Other data
         quickRangeOptions: [
            {
               label: 'This Week',
               getRange: () => {
                  const today = new Date();
                  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                  return { startDate: firstDayOfWeek, endDate: new Date() };
               }
            },
            {
               label: 'Last 7 Days',
               getRange: () => {
                  const end = new Date();
                  const start = new Date(end.getTime() - 6 24 60 60 1000);
                  return { startDate: start, endDate: end };
               }
            }
         ]
      }
   }
}
</script>
```

### TimePicker

A time input with a popup for easy time selection.

Props:
- `modelValue`: The selected time (v-model, in HH:mm or HH:mm:ss format)
- `format`: The time format to use ('12' or '24', default: '24')
- `detail`: The level of detail for time selection ('hour', 'minute', or 'second', default: 'minute')
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<TimePicker
   v-model="selectedTime"
   format="12"
   detail="second"
/>
```

### TextInput

A simple text input component with consistent styling.

Props:
- `modelValue`: The input value (v-model)
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<TextInput v-model="text" />
```

### SelectInput

A customizable select input component with support for single and multiple selections, option groups, and search functionality.

Props:
- `modelValue`: The selected value(s) (v-model, can be String, Number, or Array for multiple selections)
- `options`: An object representing the options structure
- `multiple`: Boolean to enable multiple selections (default: false)
- `searchable`: Boolean to enable search functionality (default: false)
- `idKey`: The key to use for option values (default: 'id')
- `labelKey`: The key to use for option labels (default: 'name')
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<template>
   <SelectInput
   v-model="selectedValue"
   :options="options"
   :multiple="true"
   :searchable="true"
   placeholder="Select an option"
   />
</template>

<script>
export default {
   data() {
      return {
         selectedValue: [],
         options: {
            fruits: {
               apple: { id: 1, name: 'Apple' },
               banana: { id: 2, name: 'Banana' },
            },
            vegetables: {
               carrot: { id: 3, name: 'Carrot' },
               potato: { id: 4, name: 'Potato' },
            },
         },
      }
   }
}
</script>
```

## Common Features

### Prefix and Suffix Slots

All input components (MaskedInput, NumberInput, DatePicker, DateRangePicker, and TimePicker) support prefix and suffix slots for adding custom content before or after the input field.

Usage:

```
<MaskedInput v-model="phone" mask="(###) ###-####">
   <template #prefix><icon-phone /></template>
   <template #suffix><icon-check v-if="isValid" /></template>
</MaskedInput>
```

This feature allows you to easily add icons or other custom elements to your input components.

## Development

More components and features will come with later releases.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
