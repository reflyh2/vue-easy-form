# vue-easy-form

vue-easy-form is a Vue 3 component library that provides easy-to-use, customizable form inputs with built-in formatting and validation.

## Features

- MaskedInput: Input with customizable mask for formatted text entry
- NumberInput: Input for numbers with locale-specific formatting
- DatePicker: Date input with calendar popup for easy date selection

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

## Components

### MaskedInput

A text input with a customizable mask for formatted text entry.

Props:
- `modelValue`: The input value (v-model)
- `mask`: The mask pattern (e.g., "###-##-####" for a Social Security Number)
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<template>
   <MaskedInput v-model="phoneNumber" mask="(###) ###-####" />
</template>

<script>
export default {
   data() {
      return {
         phoneNumber: ''
      }
   }
}
</script>
```

### NumberInput

An input for numbers with locale-specific formatting.

Props:
- `modelValue`: The input value (v-model)
- `locale`: The locale to use for number formatting (default: 'en-US')
- `customClass`: Custom CSS classes to apply to the input container

Usage:

```
<template>
   <NumberInput v-model="amount" locale="en-US" />
</template>

<script>
export default {
   data() {
      return {
         amount: 1000
      }
   }
}
</script>
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
<template>
   <DatePicker
      v-model="selectedDate"
      :min-date="minDate"
      :max-date="maxDate"
   />
</template>

<script>
export default {
   data() {
      return {
         selectedDate: '',
         minDate: '2024-01-01',
         maxDate: '2024-12-31'
      }
   }
}
</script>
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
<template>
   <DateRangePicker
      v-model="dateRange"
      :min-date="minDate"
      :max-date="maxDate"
      :quick-ranges="quickRangeOptions"
   />
</template>

<script>
export default {
   data() {
      return {
         dateRange: { startDate: '', endDate: '' },
         minDate: '2023-01-01',
         maxDate: '2023-12-31',
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

## Development

More components and features will come with later releases.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
