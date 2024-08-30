import '../assets/tailwind.css'
import MaskedInput from './MaskedInput.vue'
import NumberInput from './NumberInput.vue'
import DatePicker from './DatePicker.vue'
import DateRangePicker from './DateRangePicker.vue'
import TimePicker from './TimePicker.vue'
import TextInput from './TextInput.vue'
import SelectInput from './SelectInput.vue'

export {
   MaskedInput, NumberInput, DatePicker, DateRangePicker, TimePicker, TextInput,
   SelectInput
}

export default { 
   install: (app) => { 
      app.component('MaskedInput', MaskedInput), 
      app.component('NumberInput', NumberInput),
      app.component('DatePicker', DatePicker),
      app.component('DateRangePicker', DateRangePicker),
      app.component('TimePicker', TimePicker),
      app.component('TextInput', TextInput),
      app.component('SelectInput', SelectInput)
   }
}