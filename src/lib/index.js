import '../assets/tailwind.css'
import MaskedInput from './MaskedInput.vue'
import NumberInput from './NumberInput.vue'
import DatePicker from './DatePicker.vue'
import DateRangePicker from './DateRangePicker.vue'
import TimePicker from './TimePicker.vue'

export {
   MaskedInput, NumberInput, DatePicker, DateRangePicker, TimePicker
}

export default { 
   install: (app) => { 
      app.component('MaskedInput', MaskedInput), 
      app.component('NumberInput', NumberInput),
      app.component('DatePicker', DatePicker),
      app.component('DateRangePicker', DateRangePicker),
      app.component('TimePicker', TimePicker)
   }
}