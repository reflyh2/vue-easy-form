import '../assets/tailwind.css'
import MaskedInput from './MaskedInput.vue'
import NumberInput from './NumberInput.vue'
import DatePicker from './DatePicker.vue'
import CalendarPopup from './CalendarPopup.vue'
import DateRangePicker from './DateRangePicker.vue'

export {
   MaskedInput, NumberInput, DatePicker, CalendarPopup, DateRangePicker
}

export default { 
   install: (app) => { 
      app.component('MaskedInput', MaskedInput), 
      app.component('NumberInput', NumberInput),
      app.component('DatePicker', DatePicker),
      app.component('CalendarPopup', CalendarPopup),
      app.component('DateRangePicker', DateRangePicker)
   }
}